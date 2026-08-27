import { createClient } from "@/lib/supabase/browser";

export type PublicEventType =
  | "profile_view"
  | "whatsapp_click"
  | "location_click"
  | "instagram_click"
  | "product_view";

const sessionKey = "elv_analytics_session_id";

function getSessionId() {
  try {
    const current = window.localStorage.getItem(sessionKey);
    if (current) return current;
    const created = window.crypto.randomUUID();
    window.localStorage.setItem(sessionKey, created);
    return created;
  } catch {
    return window.crypto.randomUUID();
  }
}

export async function recordPublicEvent({
  businessId,
  eventType,
  productId,
}: {
  businessId: string;
  eventType: PublicEventType;
  productId?: string;
}) {
  const supabase = createClient();
  await supabase.rpc("record_public_business_event", {
    p_business_id: businessId,
    p_event_type: eventType,
    p_session_id: getSessionId(),
    p_product_id: productId ?? null,
  });
}
