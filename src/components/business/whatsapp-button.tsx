"use client";

import { MessageCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type WhatsAppButtonProps = {
  businessId: string;
  businessName: string;
  phone: string;
};

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `57${digits}`;
  return digits;
}

export function WhatsAppButton({
  businessId,
  businessName,
  phone,
}: WhatsAppButtonProps) {
  const normalizedPhone = normalizePhone(phone);
  const message = encodeURIComponent(
    `Hola, vi el perfil de ${businessName} en Emprende La Virginia y quisiera más información.`,
  );

  if (normalizedPhone.length < 10 || normalizedPhone.length > 15) return null;

  function recordClick() {
    const supabase = createClient();
    void supabase.from("business_events").insert({
      business_id: businessId,
      event_type: "whatsapp_click",
      metadata: { source: "public_profile" },
    });
  }

  return (
    <a
      href={`https://wa.me/${normalizedPhone}?text=${message}`}
      target="_blank"
      rel="nofollow noopener noreferrer"
      onClick={recordClick}
      className={cn(
        buttonVariants({ size: "lg" }),
        "mt-6 w-fit bg-emerald-600 text-white hover:bg-emerald-700",
      )}
    >
      <MessageCircle aria-hidden="true" data-icon="inline-start" />
      Escribir por WhatsApp
    </a>
  );
}
