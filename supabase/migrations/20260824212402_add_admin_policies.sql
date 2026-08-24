-- Authorization helpers live outside exposed schemas. The function is
-- SECURITY DEFINER so checking a role does not recurse through profiles RLS.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role in ('admin', 'superadmin')
    );
$$;

revoke execute on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

-- Column grants are shared by the authenticated database role. This trigger
-- prevents an owner policy from being combined with an administrator-only
-- column grant to self-approve a business.
create function private.protect_business_moderation_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.owner_id is distinct from old.owner_id then
    raise exception 'El propietario de un negocio no puede modificarse';
  end if;

  if (
    new.status is distinct from old.status
    or new.is_verified is distinct from old.is_verified
    or new.is_featured is distinct from old.is_featured
  ) and not private.is_admin() then
    raise exception 'Solo un administrador puede modificar la moderación';
  end if;

  return new;
end;
$$;

revoke execute on function private.protect_business_moderation_fields()
from public, anon, authenticated;

create trigger businesses_protect_moderation_fields
before update on public.businesses
for each row
execute function private.protect_business_moderation_fields();

-- Administrators can inspect every business and its related content.
create policy "Admins can read all profiles"
on public.profiles for select to authenticated
using ((select private.is_admin()));

create policy "Admins can read all businesses"
on public.businesses for select to authenticated
using ((select private.is_admin()));

create policy "Admins can moderate businesses"
on public.businesses for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

grant update (status, is_verified, is_featured)
on table public.businesses to authenticated;

create policy "Admins can read all category assignments"
on public.business_categories for select to authenticated
using ((select private.is_admin()));
create policy "Admins can read all products"
on public.products for select to authenticated
using ((select private.is_admin()));
create policy "Admins can read all services"
on public.services for select to authenticated
using ((select private.is_admin()));
create policy "Admins can read all promotions"
on public.promotions for select to authenticated
using ((select private.is_admin()));
create policy "Admins can read all business images"
on public.business_images for select to authenticated
using ((select private.is_admin()));
create policy "Admins can read all business hours"
on public.business_hours for select to authenticated
using ((select private.is_admin()));
create policy "Admins can read all business events"
on public.business_events for select to authenticated
using ((select private.is_admin()));

-- Category management.
grant insert, update, delete on table public.categories to authenticated;

create policy "Admins can read all categories"
on public.categories for select to authenticated
using ((select private.is_admin()));
create policy "Admins can create categories"
on public.categories for insert to authenticated
with check ((select private.is_admin()));
create policy "Admins can update categories"
on public.categories for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));
create policy "Admins can delete categories"
on public.categories for delete to authenticated
using ((select private.is_admin()));
