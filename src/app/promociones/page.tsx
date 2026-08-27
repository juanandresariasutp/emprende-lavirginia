import { ArrowRight, BadgePercent, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { formatLongDate } from "@/lib/formatters";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Promociones",
  description:
    "Descubre promociones vigentes de negocios locales de La Virginia.",
  alternates: { canonical: "/promociones" },
};

export default async function PromotionsPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data: promotions, error } = await supabase
    .from("promotions")
    .select("id, title, description, starts_at, ends_at, businesses(name, slug)")
    .eq("is_active", true)
    .lte("starts_at", now)
    .gt("ends_at", now)
    .order("ends_at", { ascending: true });

  return (
    <div className="page-container py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          Compra local
        </p>
        <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          Promociones vigentes
        </h1>
        <p className="text-muted-foreground mt-4 text-lg leading-8">
          Aprovecha beneficios publicados directamente por los negocios de La
          Virginia antes de que finalicen.
        </p>
      </div>

      {error ? (
        <p role="alert" className="text-destructive mt-8 rounded-2xl border p-6">
          No fue posible cargar las promociones. Intenta nuevamente.
        </p>
      ) : promotions && promotions.length > 0 ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promotion) => {
            const business = promotion.businesses[0];
            return (
              <article
                key={promotion.id}
                className="border-primary/15 bg-card flex flex-col overflow-hidden rounded-2xl border shadow-sm"
              >
                <div className="from-primary/15 to-accent/35 flex h-32 items-center justify-center bg-gradient-to-br">
                  <BadgePercent
                    aria-hidden="true"
                    className="text-primary size-11"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-primary text-sm font-semibold">
                    {business?.name ?? "Negocio local"}
                  </p>
                  <h2 className="text-foreground mt-2 text-xl font-bold text-balance">
                    {promotion.title}
                  </h2>
                  {promotion.description ? (
                    <p className="text-muted-foreground mt-3 text-sm leading-6">
                      {promotion.description}
                    </p>
                  ) : null}
                  <p className="text-muted-foreground mt-auto flex items-center gap-2 pt-5 text-sm">
                    <CalendarDays aria-hidden="true" className="size-4" />
                    Vigente hasta el {formatLongDate(promotion.ends_at)}
                  </p>
                  {business ? (
                    <Link
                      href={`/negocios/${business.slug}`}
                      className="text-primary focus-visible:ring-ring mt-5 inline-flex w-fit items-center gap-2 rounded-md text-sm font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      Ver negocio
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border-border bg-card mt-8 rounded-2xl border border-dashed p-8 text-center">
          <BadgePercent
            aria-hidden="true"
            className="text-primary mx-auto size-10"
          />
          <h2 className="text-foreground mt-4 text-xl font-bold">
            No hay promociones vigentes
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Vuelve pronto para conocer nuevas oportunidades.
          </p>
        </div>
      )}
    </div>
  );
}
