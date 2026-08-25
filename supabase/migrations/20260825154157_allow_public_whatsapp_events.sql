grant insert (business_id, event_type, metadata)
on table public.business_events
to anon, authenticated;

grant usage on sequence public.business_events_id_seq
to anon, authenticated;

create policy "Public can record whatsapp clicks"
on public.business_events
for insert
to anon, authenticated
with check (
  event_type = 'whatsapp_click'
  and product_id is null
  and promotion_id is null
  and session_id is null
  and metadata = '{"source":"public_profile"}'::jsonb
  and exists (
    select 1
    from public.businesses
    where businesses.id = business_events.business_id
      and businesses.status = 'approved'
      and businesses.whatsapp is not null
  )
);
