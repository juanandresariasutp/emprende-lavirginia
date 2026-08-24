create table public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  name text not null,
  description text,
  price numeric(12, 2) not null,
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint products_name_check
    check (
      name = btrim(name)
      and char_length(name) between 2 and 120
    ),
  constraint products_description_length_check
    check (description is null or char_length(description) <= 2000),
  constraint products_price_check
    check (price >= 0),
  constraint products_image_url_length_check
    check (image_url is null or char_length(image_url) <= 2048)
);

comment on table public.products is
  'Productos ofrecidos por los negocios registrados.';

comment on column public.products.price is
  'Precio vigente del producto expresado en pesos colombianos.';

create index products_business_availability_created_idx
on public.products (business_id, is_available, created_at desc);

create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

alter table public.products enable row level security;

revoke all on table public.products from anon, authenticated;
