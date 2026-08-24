-- Keep one permissive policy per role/action. This preserves public, owner and
-- administrator access while avoiding repeated policy evaluation.

drop policy "Users can read own profile" on public.profiles;
drop policy "Admins can read all profiles" on public.profiles;
create policy "Authenticated users can read permitted profiles"
on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select private.is_admin()));

drop policy "Public can read approved businesses" on public.businesses;
drop policy "Owners can read own businesses" on public.businesses;
drop policy "Admins can read all businesses" on public.businesses;
create policy "Public can read approved businesses"
on public.businesses for select to anon
using (status = 'approved');
create policy "Authenticated users can read permitted businesses"
on public.businesses for select to authenticated
using (
  status = 'approved'
  or owner_id = (select auth.uid())
  or (select private.is_admin())
);

drop policy "Owners can update own businesses" on public.businesses;
drop policy "Admins can moderate businesses" on public.businesses;
create policy "Authenticated users can update permitted businesses"
on public.businesses for update to authenticated
using (owner_id = (select auth.uid()) or (select private.is_admin()))
with check (owner_id = (select auth.uid()) or (select private.is_admin()));

drop policy "Public can read active categories" on public.categories;
drop policy "Admins can read all categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select to anon
using (is_active);
create policy "Authenticated users can read permitted categories"
on public.categories for select to authenticated
using (is_active or (select private.is_admin()));

drop policy "Public can read categories of approved businesses" on public.business_categories;
drop policy "Owners can read own category assignments" on public.business_categories;
drop policy "Admins can read all category assignments" on public.business_categories;
create policy "Public can read categories of approved businesses"
on public.business_categories for select to anon
using (
  exists (select 1 from public.businesses where businesses.id = business_categories.business_id and businesses.status = 'approved')
  and exists (select 1 from public.categories where categories.id = business_categories.category_id and categories.is_active)
);
create policy "Authenticated users can read permitted category assignments"
on public.business_categories for select to authenticated
using (
  (
    exists (select 1 from public.businesses where businesses.id = business_categories.business_id and (businesses.status = 'approved' or businesses.owner_id = (select auth.uid())))
    and exists (select 1 from public.categories where categories.id = business_categories.category_id and categories.is_active)
  )
  or (select private.is_admin())
);

drop policy "Public can read available products of approved businesses" on public.products;
drop policy "Owners can read own products" on public.products;
drop policy "Admins can read all products" on public.products;
create policy "Public can read available products of approved businesses"
on public.products for select to anon
using (is_available and exists (select 1 from public.businesses where businesses.id = products.business_id and businesses.status = 'approved'));
create policy "Authenticated users can read permitted products"
on public.products for select to authenticated
using (
  (is_available and exists (select 1 from public.businesses where businesses.id = products.business_id and businesses.status = 'approved'))
  or exists (select 1 from public.businesses where businesses.id = products.business_id and businesses.owner_id = (select auth.uid()))
  or (select private.is_admin())
);

drop policy "Public can read available services of approved businesses" on public.services;
drop policy "Owners can read own services" on public.services;
drop policy "Admins can read all services" on public.services;
create policy "Public can read available services of approved businesses"
on public.services for select to anon
using (is_available and exists (select 1 from public.businesses where businesses.id = services.business_id and businesses.status = 'approved'));
create policy "Authenticated users can read permitted services"
on public.services for select to authenticated
using (
  (is_available and exists (select 1 from public.businesses where businesses.id = services.business_id and businesses.status = 'approved'))
  or exists (select 1 from public.businesses where businesses.id = services.business_id and businesses.owner_id = (select auth.uid()))
  or (select private.is_admin())
);

drop policy "Public can read current promotions of approved businesses" on public.promotions;
drop policy "Owners can read own promotions" on public.promotions;
drop policy "Admins can read all promotions" on public.promotions;
create policy "Public can read current promotions of approved businesses"
on public.promotions for select to anon
using (
  is_active and starts_at <= now() and ends_at > now()
  and exists (select 1 from public.businesses where businesses.id = promotions.business_id and businesses.status = 'approved')
);
create policy "Authenticated users can read permitted promotions"
on public.promotions for select to authenticated
using (
  (
    is_active and starts_at <= now() and ends_at > now()
    and exists (select 1 from public.businesses where businesses.id = promotions.business_id and businesses.status = 'approved')
  )
  or exists (select 1 from public.businesses where businesses.id = promotions.business_id and businesses.owner_id = (select auth.uid()))
  or (select private.is_admin())
);

drop policy "Public can read images of approved businesses" on public.business_images;
drop policy "Owners can read own images" on public.business_images;
drop policy "Admins can read all business images" on public.business_images;
create policy "Public can read images of approved businesses"
on public.business_images for select to anon
using (exists (select 1 from public.businesses where businesses.id = business_images.business_id and businesses.status = 'approved'));
create policy "Authenticated users can read permitted business images"
on public.business_images for select to authenticated
using (
  exists (select 1 from public.businesses where businesses.id = business_images.business_id and (businesses.status = 'approved' or businesses.owner_id = (select auth.uid())))
  or (select private.is_admin())
);

drop policy "Public can read hours of approved businesses" on public.business_hours;
drop policy "Owners can read own hours" on public.business_hours;
drop policy "Admins can read all business hours" on public.business_hours;
create policy "Public can read hours of approved businesses"
on public.business_hours for select to anon
using (exists (select 1 from public.businesses where businesses.id = business_hours.business_id and businesses.status = 'approved'));
create policy "Authenticated users can read permitted business hours"
on public.business_hours for select to authenticated
using (
  exists (select 1 from public.businesses where businesses.id = business_hours.business_id and (businesses.status = 'approved' or businesses.owner_id = (select auth.uid())))
  or (select private.is_admin())
);

drop policy "Owners can read analytics of own businesses" on public.business_events;
drop policy "Admins can read all business events" on public.business_events;
create policy "Authenticated users can read permitted business events"
on public.business_events for select to authenticated
using (
  exists (select 1 from public.businesses where businesses.id = business_events.business_id and businesses.owner_id = (select auth.uid()))
  or (select private.is_admin())
);
