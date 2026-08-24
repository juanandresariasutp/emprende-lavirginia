grant select on table public.businesses to anon, authenticated;
grant select on table public.categories to anon, authenticated;
grant select on table public.business_categories to anon, authenticated;
grant select on table public.products to anon, authenticated;
grant select on table public.services to anon, authenticated;
grant select on table public.promotions to anon, authenticated;
grant select on table public.business_hours to anon, authenticated;
grant select on table public.business_images to anon, authenticated;

create policy "Public can read approved businesses"
on public.businesses
for select
to anon, authenticated
using (status = 'approved');

create policy "Public can read active categories"
on public.categories
for select
to anon, authenticated
using (is_active);

create policy "Public can read categories of approved businesses"
on public.business_categories
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.businesses
    where businesses.id = business_categories.business_id
      and businesses.status = 'approved'
  )
  and exists (
    select 1
    from public.categories
    where categories.id = business_categories.category_id
      and categories.is_active
  )
);

create policy "Public can read available products of approved businesses"
on public.products
for select
to anon, authenticated
using (
  is_available
  and exists (
    select 1
    from public.businesses
    where businesses.id = products.business_id
      and businesses.status = 'approved'
  )
);

create policy "Public can read available services of approved businesses"
on public.services
for select
to anon, authenticated
using (
  is_available
  and exists (
    select 1
    from public.businesses
    where businesses.id = services.business_id
      and businesses.status = 'approved'
  )
);

create policy "Public can read current promotions of approved businesses"
on public.promotions
for select
to anon, authenticated
using (
  is_active
  and starts_at <= now()
  and ends_at > now()
  and exists (
    select 1
    from public.businesses
    where businesses.id = promotions.business_id
      and businesses.status = 'approved'
  )
);

create policy "Public can read hours of approved businesses"
on public.business_hours
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.businesses
    where businesses.id = business_hours.business_id
      and businesses.status = 'approved'
  )
);

create policy "Public can read images of approved businesses"
on public.business_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.businesses
    where businesses.id = business_images.business_id
      and businesses.status = 'approved'
  )
);
