create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  name text not null,
  slug text not null,
  description text,
  phone text,
  whatsapp text,
  instagram text,
  facebook text,
  website text,
  address text,
  latitude numeric(9, 6),
  longitude numeric(10, 6),
  status text not null default 'pending',
  is_verified boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint businesses_owner_id_fkey
    foreign key (owner_id)
    references public.profiles (id)
    on delete cascade,
  constraint businesses_slug_key unique (slug),
  constraint businesses_name_check
    check (
      name = btrim(name)
      and char_length(name) between 2 and 120
    ),
  constraint businesses_slug_check
    check (
      char_length(slug) between 2 and 120
      and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),
  constraint businesses_description_length_check
    check (description is null or char_length(description) <= 2000),
  constraint businesses_phone_length_check
    check (phone is null or char_length(phone) between 7 and 32),
  constraint businesses_whatsapp_length_check
    check (whatsapp is null or char_length(whatsapp) between 7 and 32),
  constraint businesses_instagram_length_check
    check (instagram is null or char_length(instagram) <= 255),
  constraint businesses_facebook_length_check
    check (facebook is null or char_length(facebook) <= 255),
  constraint businesses_website_length_check
    check (website is null or char_length(website) <= 2048),
  constraint businesses_address_length_check
    check (address is null or char_length(address) <= 300),
  constraint businesses_coordinates_check
    check (
      (latitude is null and longitude is null)
      or (
        latitude is not null
        and longitude is not null
        and latitude between -90 and 90
        and longitude between -180 and 180
      )
    ),
  constraint businesses_status_check
    check (status in ('pending', 'approved', 'rejected', 'suspended'))
);

comment on table public.businesses is
  'Negocios y emprendimientos registrados en la plataforma.';

comment on column public.businesses.status is
  'Estado de moderación administrado por la plataforma.';

comment on column public.businesses.is_verified is
  'Indica que la información del negocio fue comprobada.';

comment on column public.businesses.is_featured is
  'Indica que el negocio tiene prioridad en los listados públicos.';

create index businesses_owner_id_idx
on public.businesses (owner_id);

create index businesses_public_listing_idx
on public.businesses (is_featured desc, created_at desc)
where status = 'approved';

create trigger businesses_set_updated_at
before update on public.businesses
for each row
execute function public.set_updated_at();

alter table public.businesses enable row level security;

revoke all on table public.businesses from anon, authenticated;
