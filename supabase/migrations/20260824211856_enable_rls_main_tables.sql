-- Defense in depth: every application table is protected by RLS and starts
-- without direct API privileges. Later migrations grant only the operations
-- backed by an explicit policy.
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.categories enable row level security;
alter table public.business_categories enable row level security;
alter table public.products enable row level security;
alter table public.services enable row level security;
alter table public.promotions enable row level security;
alter table public.business_hours enable row level security;
alter table public.business_images enable row level security;
alter table public.business_events enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.businesses from anon, authenticated;
revoke all on table public.categories from anon, authenticated;
revoke all on table public.business_categories from anon, authenticated;
revoke all on table public.products from anon, authenticated;
revoke all on table public.services from anon, authenticated;
revoke all on table public.promotions from anon, authenticated;
revoke all on table public.business_hours from anon, authenticated;
revoke all on table public.business_images from anon, authenticated;
revoke all on table public.business_events from anon, authenticated;

revoke all on sequence public.business_events_id_seq from anon, authenticated;
