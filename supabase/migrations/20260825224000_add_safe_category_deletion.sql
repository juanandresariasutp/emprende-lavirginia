create function public.delete_category_if_unused(p_category_id uuid)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_slug text;
begin
  if (select auth.uid()) is null or not private.is_admin() then
    raise exception 'Solo un administrador puede eliminar categorías'
      using errcode = '42501';
  end if;

  select categories.slug
  into v_slug
  from public.categories
  where categories.id = p_category_id
  for update;

  if not found then
    raise exception 'La categoría solicitada no existe'
      using errcode = 'P0002';
  end if;

  if exists (
    select 1
    from public.business_categories
    where business_categories.category_id = p_category_id
  ) then
    raise exception 'La categoría tiene negocios asociados'
      using errcode = '23503';
  end if;

  delete from public.categories
  where id = p_category_id;

  return v_slug;
end;
$$;

revoke all on function public.delete_category_if_unused(uuid) from public;
revoke all on function public.delete_category_if_unused(uuid) from anon;
revoke all on function public.delete_category_if_unused(uuid) from authenticated;
grant execute on function public.delete_category_if_unused(uuid) to authenticated;
