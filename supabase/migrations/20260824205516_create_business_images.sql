create table public.business_images (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  storage_path text not null,
  image_type text not null default 'gallery',
  alt_text text,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_images_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint business_images_business_storage_path_key
    unique (business_id, storage_path),
  constraint business_images_storage_path_check
    check (
      storage_path = btrim(storage_path)
      and char_length(storage_path) between 3 and 1024
      and storage_path !~ '^https?://'
    ),
  constraint business_images_image_type_check
    check (image_type in ('logo', 'cover', 'gallery')),
  constraint business_images_alt_text_length_check
    check (alt_text is null or char_length(alt_text) <= 250),
  constraint business_images_sort_order_check
    check (sort_order >= 0)
);

comment on table public.business_images is
  'Referencias a imágenes almacenadas en Supabase Storage para cada negocio.';

comment on column public.business_images.storage_path is
  'Ruta estable del objeto dentro del bucket; la URL se genera al consumirla.';

create unique index business_images_one_logo_per_business_idx
on public.business_images (business_id)
where image_type = 'logo';

create unique index business_images_one_cover_per_business_idx
on public.business_images (business_id)
where image_type = 'cover';

create index business_images_gallery_order_idx
on public.business_images (business_id, sort_order, created_at)
where image_type = 'gallery';

create trigger business_images_set_updated_at
before update on public.business_images
for each row
execute function public.set_updated_at();

alter table public.business_images enable row level security;

revoke all on table public.business_images from anon, authenticated;
