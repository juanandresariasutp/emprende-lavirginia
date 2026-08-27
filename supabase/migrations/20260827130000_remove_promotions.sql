-- Retira el módulo de promociones y conserva únicamente la analítica del
-- directorio, productos y canales de contacto.

drop policy if exists "Public can record validated analytics"
on public.business_events;

drop function if exists public.record_public_business_event(uuid, text, uuid, uuid, uuid);
drop function if exists private.can_record_public_business_event(uuid, text, uuid, uuid, uuid);

delete from public.business_events
where event_type = 'promotion_view';

alter table public.business_events
  drop constraint if exists business_events_event_type_check,
  drop constraint if exists business_events_single_subject_check,
  drop constraint if exists business_events_promotion_id_fkey;

drop index if exists public.business_events_promotion_created_idx;

alter table public.business_events
  drop column if exists promotion_id;

alter table public.business_events
  add constraint business_events_event_type_check
    check (event_type in (
      'profile_view',
      'whatsapp_click',
      'location_click',
      'instagram_click',
      'product_view'
    )),
  add constraint business_events_product_context_check
    check (
      (event_type = 'product_view' and product_id is not null)
      or (event_type <> 'product_view' and product_id is null)
    );

drop table if exists public.promotions;

create function private.can_record_public_business_event(
  p_business_id uuid,
  p_event_type text,
  p_session_id uuid,
  p_product_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_recent_interval interval;
begin
  if p_session_id is null or p_event_type not in (
    'profile_view',
    'whatsapp_click',
    'location_click',
    'instagram_click',
    'product_view'
  ) then
    return false;
  end if;

  if not exists (
    select 1
    from public.businesses
    where businesses.id = p_business_id
      and businesses.status = 'approved'
      and case p_event_type
        when 'whatsapp_click' then businesses.whatsapp is not null
        when 'location_click' then businesses.address is not null
          or (businesses.latitude is not null and businesses.longitude is not null)
        when 'instagram_click' then businesses.instagram is not null
        else true
      end
  ) then
    return false;
  end if;

  if p_event_type = 'product_view' then
    if p_product_id is null or not exists (
      select 1
      from public.products
      where products.id = p_product_id
        and products.business_id = p_business_id
        and products.is_available
    ) then
      return false;
    end if;
  elsif p_product_id is not null then
    return false;
  end if;

  v_recent_interval := case
    when p_event_type = 'profile_view' then interval '30 minutes'
    else interval '5 seconds'
  end;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      p_business_id::text || ':' || p_event_type || ':' || p_session_id::text
      || ':' || coalesce(p_product_id::text, ''),
      0
    )
  );

  return not exists (
    select 1
    from public.business_events
    where business_events.business_id = p_business_id
      and business_events.event_type = p_event_type
      and business_events.session_id = p_session_id
      and business_events.product_id is not distinct from p_product_id
      and business_events.created_at >= now() - v_recent_interval
  );
end;
$$;

revoke all on function private.can_record_public_business_event(uuid, text, uuid, uuid)
from public, anon, authenticated;
grant usage on schema private to anon, authenticated;
grant execute on function private.can_record_public_business_event(uuid, text, uuid, uuid)
to anon, authenticated;

grant insert (business_id, event_type, product_id, session_id, metadata)
on table public.business_events
to anon, authenticated;

create policy "Public can record validated analytics"
on public.business_events
for insert
to anon, authenticated
with check (
  metadata = '{"source":"public_profile"}'::jsonb
  and (select private.can_record_public_business_event(
    business_id,
    event_type,
    session_id,
    product_id
  ))
);

create function public.record_public_business_event(
  p_business_id uuid,
  p_event_type text,
  p_session_id uuid,
  p_product_id uuid default null
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not private.can_record_public_business_event(
    p_business_id,
    p_event_type,
    p_session_id,
    p_product_id
  ) then
    return false;
  end if;

  insert into public.business_events (
    business_id, event_type, product_id, session_id, metadata
  ) values (
    p_business_id, p_event_type, p_product_id, p_session_id,
    '{"source":"public_profile"}'::jsonb
  );

  return true;
end;
$$;

revoke all on function public.record_public_business_event(uuid, text, uuid, uuid)
from public, anon, authenticated;
grant execute on function public.record_public_business_event(uuid, text, uuid, uuid)
to anon, authenticated;

drop function if exists public.search_businesses(text, text, boolean, boolean);

create function public.search_businesses(
  p_query text,
  p_category_slug text default null,
  p_open_now boolean default false
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
  order by coalesce(ranked_matches.rank, 0) desc, businesses.name;
$$;

comment on function public.search_businesses(text, text, boolean) is
  'Busca negocios por relevancia, categoría y horario de atención.';

revoke all on function public.search_businesses(text, text, boolean) from public;
grant execute on function public.search_businesses(text, text, boolean)
to anon, authenticated;

drop policy if exists "Owners can read own image objects" on storage.objects;
drop policy if exists "Owners can upload own image objects" on storage.objects;
drop policy if exists "Owners can update own image objects" on storage.objects;
drop policy if exists "Owners can delete own image objects" on storage.objects;

create policy "Owners can read own image objects"
on storage.objects for select to authenticated
using (
  bucket_id in ('business-logos', 'business-images', 'products')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.businesses
    where businesses.id::text = (storage.foldername(name))[2]
      and businesses.owner_id = (select auth.uid())
  )
);

create policy "Owners can upload own image objects"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('business-logos', 'business-images', 'products')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.businesses
    where businesses.id::text = (storage.foldername(name))[2]
      and businesses.owner_id = (select auth.uid())
  )
);

create policy "Owners can update own image objects"
on storage.objects for update to authenticated
using (
  bucket_id in ('business-logos', 'business-images', 'products')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.businesses
    where businesses.id::text = (storage.foldername(name))[2]
      and businesses.owner_id = (select auth.uid())
  )
)
with check (
  bucket_id in ('business-logos', 'business-images', 'products')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.businesses
    where businesses.id::text = (storage.foldername(name))[2]
      and businesses.owner_id = (select auth.uid())
  )
);

create policy "Owners can delete own image objects"
on storage.objects for delete to authenticated
using (
  bucket_id in ('business-logos', 'business-images', 'products')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.businesses
    where businesses.id::text = (storage.foldername(name))[2]
      and businesses.owner_id = (select auth.uid())
  )
);
