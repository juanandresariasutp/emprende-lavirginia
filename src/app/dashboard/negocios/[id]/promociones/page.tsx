import { BadgePercent, Trash2 } from "lucide-react";
import type { Metadata } from "next";

import { deletePromotion } from "./actions";
import {
  PromotionForm,
  type EditablePromotion,
} from "@/components/forms/promotion-form";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Promociones",
  robots: { index: false },
};

type PromotionsPageProps = { params: Promise<{ id: string }> };

function colombiaInputDate(isoDate: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(isoDate));
  const value = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${value.year}-${value.month}-${value.day}T${value.hour}:${value.minute}`;
}

export default async function PromotionsPage({ params }: PromotionsPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("promotions")
    .select("id, title, description, image_url, starts_at, ends_at, is_active")
    .eq("business_id", id)
    .order("starts_at", { ascending: false });
  const promotions = (data ?? []).map((promotion) => ({
    ...promotion,
    starts_at: colombiaInputDate(promotion.starts_at),
    ends_at: colombiaInputDate(promotion.ends_at),
  })) satisfies EditablePromotion[];

  return (
    <section>
      <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
        <BadgePercent aria-hidden="true" className="size-4" /> Campañas
      </p>
      <h1 className="text-foreground mt-2 text-3xl font-bold">Promociones</h1>
      <p className="text-muted-foreground mt-3">
        Crea ofertas y define exactamente cuándo estarán vigentes.
      </p>
      <div className="border-border bg-card mt-7 rounded-2xl border p-5 shadow-sm">
        <h2 className="text-foreground mb-4 font-bold">Nueva promoción</h2>
        <PromotionForm businessId={id} />
      </div>
      <div className="mt-7 grid gap-4">
        {promotions.map((promotion) => (
          <article
            key={promotion.id}
            className="border-border bg-card rounded-2xl border p-5 shadow-sm"
          >
            <PromotionForm businessId={id} promotion={promotion} />
            <div className="border-border mt-4 flex justify-end border-t pt-4">
              <form action={deletePromotion.bind(null, id, promotion.id)}>
                <button
                  className={cn(
                    buttonVariants({ variant: "destructive", size: "sm" }),
                  )}
                >
                  <Trash2 aria-hidden="true" className="size-4" /> Eliminar
                </button>
              </form>
            </div>
          </article>
        ))}
        {promotions.length === 0 ? (
          <p className="border-border text-muted-foreground rounded-2xl border border-dashed p-8 text-center text-sm">
            Aún no has creado promociones.
          </p>
        ) : null}
      </div>
    </section>
  );
}
