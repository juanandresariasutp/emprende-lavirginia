create function public.suspend_business(p_business_id uuid)
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
    raise exception 'Solo un administrador puede suspender negocios'
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
    raise exception 'Solo se pueden suspender negocios aprobados'
      using errcode = '22023';
  end if;

  update public.businesses
  set status = 'suspended'
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
    'suspend',
    v_previous_status,
    'suspended'
  );

  return v_slug;
end;
$$;

revoke all on function public.suspend_business(uuid) from public;
revoke all on function public.suspend_business(uuid) from anon;
revoke all on function public.suspend_business(uuid) from authenticated;
grant execute on function public.suspend_business(uuid) to authenticated;
