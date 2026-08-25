alter table public.businesses
add column search_vector tsvector
generated always as (
  setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('spanish', coalesce(description, '')), 'B')
) stored;

alter table public.products
add column search_vector tsvector
generated always as (
  setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('spanish', coalesce(description, '')), 'B')
) stored;

alter table public.services
add column search_vector tsvector
generated always as (
  setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('spanish', coalesce(description, '')), 'B')
) stored;

alter table public.categories
add column search_vector tsvector
generated always as (
  setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('spanish', coalesce(description, '')), 'B')
) stored;

create index businesses_search_vector_idx
on public.businesses using gin (search_vector)
where status = 'approved';

create index products_search_vector_idx
on public.products using gin (search_vector)
where is_available;

create index services_search_vector_idx
on public.services using gin (search_vector)
where is_available;

create index categories_search_vector_idx
on public.categories using gin (search_vector)
where is_active;

create or replace function public.search_businesses(p_query text)
returns table (business_id uuid, rank real)
language sql
stable
security invoker
set search_path = ''
as $$
  with search_query as (
    select websearch_to_tsquery('spanish', left(btrim(p_query), 100)) as value
  ), matches as (
    select
      businesses.id as business_id,
      ts_rank_cd(businesses.search_vector, search_query.value) as rank
    from public.businesses
    cross join search_query
    where businesses.status = 'approved'
      and businesses.search_vector @@ search_query.value

    union all

    select
      products.business_id,
      ts_rank_cd(products.search_vector, search_query.value) * 0.8 as rank
    from public.products
    cross join search_query
    where products.is_available
      and products.search_vector @@ search_query.value

    union all

    select
      services.business_id,
      ts_rank_cd(services.search_vector, search_query.value) * 0.8 as rank
    from public.services
    cross join search_query
    where services.is_available
      and services.search_vector @@ search_query.value

    union all

    select
      business_categories.business_id,
      ts_rank_cd(categories.search_vector, search_query.value) * 0.6 as rank
    from public.categories
    join public.business_categories
      on business_categories.category_id = categories.id
    cross join search_query
    where categories.is_active
      and categories.search_vector @@ search_query.value
  )
  select matches.business_id, sum(matches.rank)::real as rank
  from matches
  join public.businesses on businesses.id = matches.business_id
  where businesses.status = 'approved'
  group by matches.business_id
  order by rank desc, matches.business_id;
$$;

comment on function public.search_businesses(text) is
  'Busca negocios aprobados por negocio, producto, servicio o categoría y los ordena por relevancia.';

revoke all on function public.search_businesses(text) from public;
grant execute on function public.search_businesses(text) to anon, authenticated;
