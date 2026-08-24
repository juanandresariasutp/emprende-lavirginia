create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  is_active boolean not null default true,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_key unique (slug),
  constraint categories_name_check
    check (
      name = btrim(name)
      and char_length(name) between 2 and 80
    ),
  constraint categories_slug_check
    check (
      char_length(slug) between 2 and 80
      and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),
  constraint categories_description_length_check
    check (description is null or char_length(description) <= 500),
  constraint categories_sort_order_check
    check (sort_order >= 0)
);

comment on table public.categories is
  'Catálogo administrable de categorías para clasificar negocios.';

create unique index categories_name_lower_key
on public.categories (lower(name));

create index categories_active_order_idx
on public.categories (sort_order, name)
where is_active;

create trigger categories_set_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

create table public.business_categories (
  business_id uuid not null,
  category_id uuid not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  constraint business_categories_pkey
    primary key (business_id, category_id),
  constraint business_categories_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint business_categories_category_id_fkey
    foreign key (category_id)
    references public.categories (id)
    on delete cascade
);

comment on table public.business_categories is
  'Relación entre negocios y sus categorías principal y secundarias.';

comment on column public.business_categories.is_primary is
  'Solo una categoría puede estar marcada como principal por negocio.';

create index business_categories_category_id_idx
on public.business_categories (category_id);

create unique index business_categories_one_primary_per_business_idx
on public.business_categories (business_id)
where is_primary;

alter table public.categories enable row level security;
alter table public.business_categories enable row level security;

revoke all on table public.categories from anon, authenticated;
revoke all on table public.business_categories from anon, authenticated;
