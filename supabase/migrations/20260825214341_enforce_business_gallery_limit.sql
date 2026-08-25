create or replace function public.enforce_business_gallery_limit()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.image_type = 'gallery' and (
    select count(*)
    from public.business_images
    where business_id = new.business_id
      and image_type = 'gallery'
      and id <> new.id
  ) >= 6 then
    raise exception 'A business gallery cannot contain more than 6 images'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_business_gallery_limit() from public;
revoke all on function public.enforce_business_gallery_limit() from anon;
revoke all on function public.enforce_business_gallery_limit() from authenticated;

create trigger business_images_enforce_gallery_limit
before insert or update of business_id, image_type
on public.business_images
for each row
execute function public.enforce_business_gallery_limit();
