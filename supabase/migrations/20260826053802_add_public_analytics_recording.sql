drop policy if exists "Public can record whatsapp clicks"
on public.business_events;

revoke insert on table public.business_events from anon, authenticated;
revoke usage on sequence public.business_events_id_seq from anon, authenticated;

create function public.record_public_business_event(
  p_business_id uuid,
  p_event_type text,
  p_session_id uuid,
  p_product_id uuid default null,
  p_promotion_id uuid default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_recent_interval interval;
begin
  if p_session_id is null then
    raise exception 'La sesión anónima es obligatoria'
      using errcode = '22023';
  end if;

  if p_event_type not in (
    'profile_view',
    'whatsapp_click',
    'location_click',
    'instagram_click',
    'product_view',
    'promotion_view'
  ) then
    raise exception 'El tipo de evento no es válido'
      using errcode = '22023';
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
    raise exception 'El negocio o la interacción no están disponibles'
      using errcode = 'P0002';
  end if;

  if p_event_type = 'product_view' then
    if p_product_id is null or p_promotion_id is not null or not exists (
      select 1
      from public.products
      where products.id = p_product_id
        and products.business_id = p_business_id
        and products.is_available
    ) then
      raise exception 'El producto no está disponible'
        using errcode = 'P0002';
    end if;
  elsif p_event_type = 'promotion_view' then
    if p_promotion_id is null or p_product_id is not null or not exists (
      select 1
      from public.promotions
      where promotions.id = p_promotion_id
        and promotions.business_id = p_business_id
        and promotions.is_active
        and promotions.starts_at <= now()
        and promotions.ends_at >= now()
    ) then
      raise exception 'La promoción no está disponible'
        using errcode = 'P0002';
    end if;
  elsif p_product_id is not null or p_promotion_id is not null then
    raise exception 'El evento no admite un producto o una promoción'
      using errcode = '22023';
  end if;

  v_recent_interval := case
    when p_event_type = 'profile_view' then interval '30 minutes'
    else interval '5 seconds'
  end;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      p_business_id::text || ':' || p_event_type || ':' || p_session_id::text
      || ':' || coalesce(p_product_id::text, '')
      || ':' || coalesce(p_promotion_id::text, ''),
      0
    )
  );

  if exists (
    select 1
    from public.business_events
    where business_events.business_id = p_business_id
      and business_events.event_type = p_event_type
      and business_events.session_id = p_session_id
      and business_events.product_id is not distinct from p_product_id
      and business_events.promotion_id is not distinct from p_promotion_id
      and business_events.created_at >= now() - v_recent_interval
  ) then
    return false;
  end if;

  insert into public.business_events (
    business_id,
    event_type,
    product_id,
    promotion_id,
    session_id,
    metadata
  )
  values (
    p_business_id,
    p_event_type,
    p_product_id,
    p_promotion_id,
    p_session_id,
    '{"source":"public_profile"}'::jsonb
  );

  return true;
end;
$$;

revoke all on function public.record_public_business_event(uuid, text, uuid, uuid, uuid)
from public, anon, authenticated;
grant execute on function public.record_public_business_event(uuid, text, uuid, uuid, uuid)
to anon, authenticated;

comment on function public.record_public_business_event(uuid, text, uuid, uuid, uuid)
is 'Registra interacciones públicas validadas y reduce duplicados evidentes por sesión.';
