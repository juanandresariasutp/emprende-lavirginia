insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'business-logos',
    'business-logos',
    true,
    2097152,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'business-images',
    'business-images',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'products',
    'products',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'promotions',
    'promotions',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Owners can read own image objects"
on storage.objects for select
to authenticated
using (
  bucket_id in ('business-logos', 'business-images', 'products', 'promotions')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.businesses
    where businesses.id::text = (storage.foldername(name))[2]
      and businesses.owner_id = (select auth.uid())
  )
);

create policy "Owners can upload own image objects"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('business-logos', 'business-images', 'products', 'promotions')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.businesses
    where businesses.id::text = (storage.foldername(name))[2]
      and businesses.owner_id = (select auth.uid())
  )
);

create policy "Owners can update own image objects"
on storage.objects for update
to authenticated
using (
  bucket_id in ('business-logos', 'business-images', 'products', 'promotions')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.businesses
    where businesses.id::text = (storage.foldername(name))[2]
      and businesses.owner_id = (select auth.uid())
  )
)
with check (
  bucket_id in ('business-logos', 'business-images', 'products', 'promotions')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.businesses
    where businesses.id::text = (storage.foldername(name))[2]
      and businesses.owner_id = (select auth.uid())
  )
);

create policy "Owners can delete own image objects"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('business-logos', 'business-images', 'products', 'promotions')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.businesses
    where businesses.id::text = (storage.foldername(name))[2]
      and businesses.owner_id = (select auth.uid())
  )
);
