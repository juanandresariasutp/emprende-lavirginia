-- Profiles are created in the same transaction as Auth users. This also works
-- when email confirmation is enabled and no authenticated session exists yet.
create function private.create_owner_profile_after_signup()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    'owner'
  );

  return new;
end;
$$;

revoke execute on function private.create_owner_profile_after_signup()
from public, anon, authenticated;

create trigger create_owner_profile_after_signup
after insert on auth.users
for each row
execute function private.create_owner_profile_after_signup();
