create table public.business_events (
  id bigint generated always as identity primary key,
  business_id uuid not null,
  event_type text not null,
  product_id uuid,
  promotion_id uuid,
  session_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint business_events_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint business_events_product_id_fkey
    foreign key (product_id)
    references public.products (id)
    on delete set null,
  constraint business_events_promotion_id_fkey
    foreign key (promotion_id)
    references public.promotions (id)
    on delete set null,
  constraint business_events_event_type_check
    check (
      event_type in (
        'profile_view',
        'whatsapp_click',
        'location_click',
        'instagram_click',
        'product_view',
        'promotion_view'
      )
    ),
  constraint business_events_single_subject_check
    check (num_nonnulls(product_id, promotion_id) <= 1),
  constraint business_events_metadata_object_check
    check (jsonb_typeof(metadata) = 'object')
);

comment on table public.business_events is
  'Eventos append-only usados para medir el valor generado a los negocios.';

comment on column public.business_events.session_id is
  'Identificador anónimo opcional para reducir duplicados evidentes en análisis posteriores.';

create index business_events_business_type_created_idx
on public.business_events (business_id, event_type, created_at desc);

create index business_events_product_created_idx
on public.business_events (product_id, created_at desc)
where product_id is not null;

create index business_events_promotion_created_idx
on public.business_events (promotion_id, created_at desc)
where promotion_id is not null;

alter table public.business_events enable row level security;

revoke all on table public.business_events from anon, authenticated;
revoke all on sequence public.business_events_id_seq from anon, authenticated;
