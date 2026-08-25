create function public.reject_business(
  p_business_id uuid,
  p_reason text
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_previous_status text;
  v_slug text;
  v_reason text := btrim(coalesce(p_reason, ''));
begin
  if (select auth.uid()) is null or not private.is_admin() then
    raise exception 'Solo un administrador puede rechazar negocios'
      using errcode = '42501';
  end if;

  if char_length(v_reason) < 2 or char_length(v_reason) > 1000 then
    raise exception 'El motivo debe tener entre 2 y 1000 caracteres'
      using errcode = '22023';
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

  if v_previous_status <> 'pending' then
    raise exception 'Solo se pueden rechazar negocios pendientes'
      using errcode = '22023';
  end if;

  update public.businesses
  set status = 'rejected'
  where id = p_business_id;

  insert into public.business_moderation_actions (
    business_id,
    admin_id,
    action,
    previous_status,
    new_status,
    reason
  )
  values (
    p_business_id,
    (select auth.uid()),
    'reject',
    v_previous_status,
    'rejected',
    v_reason
  );

  return v_slug;
end;
$$;

revoke all on function public.reject_business(uuid, text) from public;
revoke all on function public.reject_business(uuid, text) from anon;
revoke all on function public.reject_business(uuid, text) from authenticated;
grant execute on function public.reject_business(uuid, text) to authenticated;
