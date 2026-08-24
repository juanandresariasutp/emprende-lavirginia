-- Profiles: users can bootstrap and maintain only their own non-privileged data.
grant select on table public.profiles to authenticated;
grant insert (id, full_name) on table public.profiles to authenticated;
grant update (full_name) on table public.profiles to authenticated;

create policy "Users can read own profile"
on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy "Users can create own profile"
on public.profiles for insert to authenticated
with check (id = (select auth.uid()));

create policy "Users can update own profile"
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- Businesses: moderation fields remain unavailable through column privileges.
grant insert (
  owner_id, name, slug, description, phone, whatsapp, instagram, facebook,
  website, address, latitude, longitude
) on table public.businesses to authenticated;
grant update (
  name, slug, description, phone, whatsapp, instagram, facebook,
  website, address, latitude, longitude
) on table public.businesses to authenticated;

create policy "Owners can read own businesses"
on public.businesses for select to authenticated
using (owner_id = (select auth.uid()));

create policy "Owners can create own businesses"
on public.businesses for insert to authenticated
with check (owner_id = (select auth.uid()));

create policy "Owners can update own businesses"
on public.businesses for update to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

-- Products.
grant insert, update, delete on table public.products to authenticated;

create policy "Owners can read own products"
on public.products for select to authenticated
using (exists (
  select 1 from public.businesses
  where businesses.id = products.business_id
    and businesses.owner_id = (select auth.uid())
));

create policy "Owners can create own products"
on public.products for insert to authenticated
with check (exists (
  select 1 from public.businesses
  where businesses.id = products.business_id
    and businesses.owner_id = (select auth.uid())
));

create policy "Owners can update own products"
on public.products for update to authenticated
using (exists (
  select 1 from public.businesses
  where businesses.id = products.business_id
    and businesses.owner_id = (select auth.uid())
))
with check (exists (
  select 1 from public.businesses
  where businesses.id = products.business_id
    and businesses.owner_id = (select auth.uid())
));

create policy "Owners can delete own products"
on public.products for delete to authenticated
using (exists (
  select 1 from public.businesses
  where businesses.id = products.business_id
    and businesses.owner_id = (select auth.uid())
));

-- Services.
grant insert, update, delete on table public.services to authenticated;

create policy "Owners can read own services"
on public.services for select to authenticated
using (exists (select 1 from public.businesses where businesses.id = services.business_id and businesses.owner_id = (select auth.uid())));
create policy "Owners can create own services"
on public.services for insert to authenticated
with check (exists (select 1 from public.businesses where businesses.id = services.business_id and businesses.owner_id = (select auth.uid())));
create policy "Owners can update own services"
on public.services for update to authenticated
using (exists (select 1 from public.businesses where businesses.id = services.business_id and businesses.owner_id = (select auth.uid())))
with check (exists (select 1 from public.businesses where businesses.id = services.business_id and businesses.owner_id = (select auth.uid())));
create policy "Owners can delete own services"
on public.services for delete to authenticated
using (exists (select 1 from public.businesses where businesses.id = services.business_id and businesses.owner_id = (select auth.uid())));

-- Promotions.
grant insert, update, delete on table public.promotions to authenticated;

create policy "Owners can read own promotions"
on public.promotions for select to authenticated
using (exists (select 1 from public.businesses where businesses.id = promotions.business_id and businesses.owner_id = (select auth.uid())));
create policy "Owners can create own promotions"
on public.promotions for insert to authenticated
with check (exists (select 1 from public.businesses where businesses.id = promotions.business_id and businesses.owner_id = (select auth.uid())));
create policy "Owners can update own promotions"
on public.promotions for update to authenticated
using (exists (select 1 from public.businesses where businesses.id = promotions.business_id and businesses.owner_id = (select auth.uid())))
with check (exists (select 1 from public.businesses where businesses.id = promotions.business_id and businesses.owner_id = (select auth.uid())));
create policy "Owners can delete own promotions"
on public.promotions for delete to authenticated
using (exists (select 1 from public.businesses where businesses.id = promotions.business_id and businesses.owner_id = (select auth.uid())));

-- Images.
grant insert, update, delete on table public.business_images to authenticated;

create policy "Owners can read own images"
on public.business_images for select to authenticated
using (exists (select 1 from public.businesses where businesses.id = business_images.business_id and businesses.owner_id = (select auth.uid())));
create policy "Owners can create own images"
on public.business_images for insert to authenticated
with check (exists (select 1 from public.businesses where businesses.id = business_images.business_id and businesses.owner_id = (select auth.uid())));
create policy "Owners can update own images"
on public.business_images for update to authenticated
using (exists (select 1 from public.businesses where businesses.id = business_images.business_id and businesses.owner_id = (select auth.uid())))
with check (exists (select 1 from public.businesses where businesses.id = business_images.business_id and businesses.owner_id = (select auth.uid())));
create policy "Owners can delete own images"
on public.business_images for delete to authenticated
using (exists (select 1 from public.businesses where businesses.id = business_images.business_id and businesses.owner_id = (select auth.uid())));

-- Business hours.
grant insert, update, delete on table public.business_hours to authenticated;

create policy "Owners can read own hours"
on public.business_hours for select to authenticated
using (exists (select 1 from public.businesses where businesses.id = business_hours.business_id and businesses.owner_id = (select auth.uid())));
create policy "Owners can create own hours"
on public.business_hours for insert to authenticated
with check (exists (select 1 from public.businesses where businesses.id = business_hours.business_id and businesses.owner_id = (select auth.uid())));
create policy "Owners can update own hours"
on public.business_hours for update to authenticated
using (exists (select 1 from public.businesses where businesses.id = business_hours.business_id and businesses.owner_id = (select auth.uid())))
with check (exists (select 1 from public.businesses where businesses.id = business_hours.business_id and businesses.owner_id = (select auth.uid())));
create policy "Owners can delete own hours"
on public.business_hours for delete to authenticated
using (exists (select 1 from public.businesses where businesses.id = business_hours.business_id and businesses.owner_id = (select auth.uid())));

-- Category assignments are managed by owners, but only active categories can
-- be attached to one of their businesses.
grant insert, update, delete on table public.business_categories to authenticated;

create policy "Owners can read own category assignments"
on public.business_categories for select to authenticated
using (exists (select 1 from public.businesses where businesses.id = business_categories.business_id and businesses.owner_id = (select auth.uid())));
create policy "Owners can create own category assignments"
on public.business_categories for insert to authenticated
with check (
  exists (select 1 from public.businesses where businesses.id = business_categories.business_id and businesses.owner_id = (select auth.uid()))
  and exists (select 1 from public.categories where categories.id = business_categories.category_id and categories.is_active)
);
create policy "Owners can update own category assignments"
on public.business_categories for update to authenticated
using (exists (select 1 from public.businesses where businesses.id = business_categories.business_id and businesses.owner_id = (select auth.uid())))
with check (
  exists (select 1 from public.businesses where businesses.id = business_categories.business_id and businesses.owner_id = (select auth.uid()))
  and exists (select 1 from public.categories where categories.id = business_categories.category_id and categories.is_active)
);
create policy "Owners can delete own category assignments"
on public.business_categories for delete to authenticated
using (exists (select 1 from public.businesses where businesses.id = business_categories.business_id and businesses.owner_id = (select auth.uid())));

-- Owners may inspect analytics generated for their businesses. Event writes
-- remain server-side only.
grant select on table public.business_events to authenticated;

create policy "Owners can read analytics of own businesses"
on public.business_events for select to authenticated
using (exists (
  select 1 from public.businesses
  where businesses.id = business_events.business_id
    and businesses.owner_id = (select auth.uid())
));
