import "client-only";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig } from "@/config/supabase";

export function createClient() {
  const { url, publishableKey } = getSupabaseConfig();

  return createBrowserClient(url, publishableKey);
}
