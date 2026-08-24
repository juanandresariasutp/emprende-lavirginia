create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  day_of_week smallint not null,
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_hours_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint business_hours_day_of_week_check
    check (day_of_week between 0 and 6),
  constraint business_hours_schedule_check
    check (
      (is_closed and opens_at is null and closes_at is null)
      or (
        not is_closed
        and opens_at is not null
        and closes_at is not null
        and opens_at < closes_at
      )
    )
);

comment on table public.business_hours is
  'Franjas semanales de atención de cada negocio; 0 representa domingo y 6 sábado.';

comment on column public.business_hours.day_of_week is
  'Día ISO adaptado a la interfaz: 0 domingo, 1 lunes, ..., 6 sábado.';

create unique index business_hours_one_closed_row_per_day_idx
on public.business_hours (business_id, day_of_week)
where is_closed;

create unique index business_hours_unique_open_range_idx
on public.business_hours (business_id, day_of_week, opens_at, closes_at)
where not is_closed;

create function public.enforce_business_hours_day_state()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(
    hashtextextended(new.business_id::text || ':' || new.day_of_week::text, 0)
  );

  if new.is_closed and exists (
    select 1
    from public.business_hours as hours
    where hours.business_id = new.business_id
      and hours.day_of_week = new.day_of_week
      and hours.id <> new.id
  ) then
    raise exception 'Un día cerrado no puede tener otras franjas horarias';
  end if;

  if not new.is_closed and exists (
    select 1
    from public.business_hours as hours
    where hours.business_id = new.business_id
      and hours.day_of_week = new.day_of_week
      and hours.is_closed
      and hours.id <> new.id
  ) then
    raise exception 'Un día con franjas horarias no puede estar marcado como cerrado';
  end if;

  return new;
end;
$$;

create trigger business_hours_enforce_day_state
before insert or update on public.business_hours
for each row
execute function public.enforce_business_hours_day_state();

create trigger business_hours_set_updated_at
before update on public.business_hours
for each row
execute function public.set_updated_at();

alter table public.business_hours enable row level security;

revoke all on table public.business_hours from anon, authenticated;
revoke execute on function public.enforce_business_hours_day_state()
from public, anon, authenticated;
