create table public.business_moderation_actions (
  id bigint generated always as identity primary key,
  business_id uuid not null,
  admin_id uuid not null,
  action text not null,
  previous_status text not null,
  new_status text not null,
  reason text,
  created_at timestamptz not null default now(),
  constraint business_moderation_actions_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint business_moderation_actions_admin_id_fkey
    foreign key (admin_id)
    references public.profiles (id)
    on delete restrict,
  constraint business_moderation_actions_action_check
    check (action in ('approve', 'reject', 'suspend')),
  constraint business_moderation_actions_previous_status_check
    check (previous_status in ('pending', 'approved', 'rejected', 'suspended')),
  constraint business_moderation_actions_new_status_check
    check (new_status in ('pending', 'approved', 'rejected', 'suspended')),
  constraint business_moderation_actions_reason_length_check
    check (reason is null or char_length(btrim(reason)) between 2 and 1000)
);

comment on table public.business_moderation_actions is
  'Registro append-only de las decisiones administrativas sobre negocios.';

create index business_moderation_actions_business_created_idx
on public.business_moderation_actions (business_id, created_at desc);

create index business_moderation_actions_admin_created_idx
on public.business_moderation_actions (admin_id, created_at desc);

alter table public.business_moderation_actions enable row level security;

revoke all on table public.business_moderation_actions from anon, authenticated;
revoke all on sequence public.business_moderation_actions_id_seq
from anon, authenticated;

grant select, insert on table public.business_moderation_actions
to authenticated;
grant usage, select on sequence public.business_moderation_actions_id_seq
to authenticated;

create policy "Admins can read moderation actions"
on public.business_moderation_actions for select
to authenticated
using ((select private.is_admin()));

create policy "Admins can create moderation actions"
on public.business_moderation_actions for insert
to authenticated
with check (
  (select private.is_admin())
  and admin_id = (select auth.uid())
);

create function public.approve_business(p_business_id uuid)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_previous_status text;
  v_slug text;
begin
  if (select auth.uid()) is null or not private.is_admin() then
    raise exception 'Solo un administrador puede aprobar negocios'
      using errcode = '42501';
  end if;

  select businesses.status, businesses.slug
  into v_previous_status, v_slug
  from public.businesses
  where businesses.id = p_business_id
  for update;

  if not found then
    raise exception 'El negocio solicitado no existe'
      using errcode = 'P0002';
  end if;

  if v_previous_status <> 'approved' then
    update public.businesses
    set status = 'approved'
    where id = p_business_id;

    insert into public.business_moderation_actions (
      business_id,
      admin_id,
      action,
      previous_status,
      new_status
    )
    values (
      p_business_id,
      (select auth.uid()),
      'approve',
      v_previous_status,
      'approved'
    );
  end if;

  return v_slug;
end;
$$;

revoke all on function public.approve_business(uuid) from public;
revoke all on function public.approve_business(uuid) from anon;
revoke all on function public.approve_business(uuid) from authenticated;
grant execute on function public.approve_business(uuid) to authenticated;
