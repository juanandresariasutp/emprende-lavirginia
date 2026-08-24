create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  title text not null,
  description text,
  image_url text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promotions_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint promotions_title_check
    check (
      title = btrim(title)
      and char_length(title) between 2 and 140
    ),
  constraint promotions_description_length_check
    check (description is null or char_length(description) <= 2000),
  constraint promotions_image_url_length_check
    check (image_url is null or char_length(image_url) <= 2048),
  constraint promotions_date_range_check
    check (ends_at > starts_at)
);

comment on table public.promotions is
  'Promociones temporales publicadas por los negocios.';

comment on column public.promotions.is_active is
  'Control manual de publicación; la vigencia también depende de starts_at y ends_at.';

create index promotions_business_created_idx
on public.promotions (business_id, created_at desc);

create index promotions_active_window_idx
on public.promotions (ends_at, starts_at)
where is_active;

create trigger promotions_set_updated_at
before update on public.promotions
for each row
execute function public.set_updated_at();

alter table public.promotions enable row level security;

revoke all on table public.promotions from anon, authenticated;
