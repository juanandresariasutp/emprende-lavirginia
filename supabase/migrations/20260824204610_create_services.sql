create table public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  name text not null,
  description text,
  price numeric(12, 2),
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint services_name_check
    check (
      name = btrim(name)
      and char_length(name) between 2 and 120
    ),
  constraint services_description_length_check
    check (description is null or char_length(description) <= 2000),
  constraint services_price_check
    check (price is null or price >= 0),
  constraint services_image_url_length_check
    check (image_url is null or char_length(image_url) <= 2048)
);

comment on table public.services is
  'Servicios ofrecidos por los negocios registrados.';

comment on column public.services.price is
  'Precio opcional del servicio expresado en pesos colombianos.';

create index services_business_availability_created_idx
on public.services (business_id, is_available, created_at desc);

create trigger services_set_updated_at
before update on public.services
for each row
execute function public.set_updated_at();

alter table public.services enable row level security;

revoke all on table public.services from anon, authenticated;
