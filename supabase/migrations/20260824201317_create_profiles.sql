create table public.profiles (
  id uuid primary key,
  full_name text,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_id_fkey
    foreign key (id)
    references auth.users (id)
    on delete cascade,
  constraint profiles_role_check
    check (role in ('owner', 'admin', 'superadmin')),
  constraint profiles_full_name_length_check
    check (
      full_name is null
      or char_length(btrim(full_name)) between 2 and 120
    )
);

comment on table public.profiles is
  'Información pública y rol interno asociado a una cuenta de Supabase Auth.';

comment on column public.profiles.role is
  'Rol de autorización administrado por la plataforma; nunca por el usuario.';

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
