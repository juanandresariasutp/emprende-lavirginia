drop function public.search_businesses(text, text, boolean);

create function public.search_businesses(
  p_query text,
  p_category_slug text default null,
  p_open_now boolean default false,
  p_has_promotions boolean default false
)
returns table (business_id uuid, rank real)
language sql
stable
security invoker
set search_path = ''
as $$
  with search_query as (
    select
      nullif(left(btrim(p_query), 100), '') as term,
      case
        when nullif(left(btrim(p_query), 100), '') is null then null
        else websearch_to_tsquery('spanish', left(btrim(p_query), 100))
      end as value,
      timezone('America/Bogota', current_timestamp) as local_now
  ), matches as (
    select businesses.id as business_id,
      ts_rank_cd(businesses.search_vector, search_query.value) as rank
    from public.businesses cross join search_query
    where businesses.status = 'approved'
      and businesses.search_vector @@ search_query.value
    union all
    select products.business_id,
      ts_rank_cd(products.search_vector, search_query.value) * 0.8
    from public.products cross join search_query
    where products.is_available
      and products.search_vector @@ search_query.value
    union all
    select services.business_id,
      ts_rank_cd(services.search_vector, search_query.value) * 0.8
    from public.services cross join search_query
    where services.is_available
      and services.search_vector @@ search_query.value
    union all
    select business_categories.business_id,
      ts_rank_cd(categories.search_vector, search_query.value) * 0.6
    from public.categories
    join public.business_categories
      on business_categories.category_id = categories.id
    cross join search_query
    where categories.is_active
      and categories.search_vector @@ search_query.value
  ), ranked_matches as (
    select matches.business_id, sum(matches.rank)::real as rank
    from matches
    group by matches.business_id
  )
  select businesses.id, coalesce(ranked_matches.rank, 0)::real
  from public.businesses
  cross join search_query
  left join ranked_matches on ranked_matches.business_id = businesses.id
  where businesses.status = 'approved'
    and (search_query.term is null or ranked_matches.business_id is not null)
    and (
      nullif(btrim(p_category_slug), '') is null
      or exists (
        select 1
        from public.business_categories
        join public.categories
          on categories.id = business_categories.category_id
        where business_categories.business_id = businesses.id
          and categories.slug = p_category_slug
          and categories.is_active
      )
    )
    and (
      not p_open_now
      or exists (
        select 1
        from public.business_hours
        where business_hours.business_id = businesses.id
          and business_hours.day_of_week =
            extract(dow from search_query.local_now)::smallint
          and not business_hours.is_closed
          and search_query.local_now::time >= business_hours.opens_at
          and search_query.local_now::time < business_hours.closes_at
      )
    )
    and (
      not p_has_promotions
      or exists (
        select 1
        from public.promotions
        where promotions.business_id = businesses.id
          and promotions.is_active
          and promotions.starts_at <= current_timestamp
          and promotions.ends_at > current_timestamp
      )
    )
  order by coalesce(ranked_matches.rank, 0) desc, businesses.name;
$$;

comment on function public.search_businesses(text, text, boolean, boolean) is
  'Busca negocios por relevancia, categoría, horario y promociones vigentes.';

revoke all on function public.search_businesses(text, text, boolean, boolean)
from public;
grant execute on function public.search_businesses(text, text, boolean, boolean)
to anon, authenticated;
