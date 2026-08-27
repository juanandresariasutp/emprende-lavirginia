import { BadgePercent, CalendarDays } from "lucide-react";

import { formatShortDate } from "@/lib/formatters";

export type ActivePromotion = {
  id: string;
  title: string;
  description: string | null;
  ends_at: string;
  businesses: { name: string; slug: string }[];
};

type ActivePromotionsProps = {
  promotions: ActivePromotion[];
};

export function ActivePromotions({ promotions }: ActivePromotionsProps) {
  return (
    <section className="bg-secondary/45 border-y">
      <div className="page-container py-14 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            Aprovecha la oportunidad
          </p>
          <h2 className="text-secondary-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Promociones activas
          </h2>
          <p className="text-muted-foreground mt-4 leading-7">
            Beneficios vigentes publicados por los negocios de La Virginia.
          </p>
        </div>

        {promotions.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promotion) => (
              <article
                key={promotion.id}
                className="border-primary/15 bg-card overflow-hidden rounded-2xl border shadow-sm"
              >
                <div className="from-primary/15 to-accent/35 flex h-28 items-center justify-center bg-gradient-to-br">
                  <BadgePercent
                    aria-hidden="true"
                    className="text-primary size-10"
                  />
                </div>
                <div className="p-6">
                  <p className="text-primary text-sm font-semibold">
                    {promotion.businesses[0]?.name ?? "Negocio local"}
                  </p>
                  <h3 className="text-foreground mt-2 text-xl font-bold text-balance">
                    {promotion.title}
                  </h3>
                  {promotion.description ? (
                    <p className="text-muted-foreground mt-3 line-clamp-3 text-sm leading-6">
                      {promotion.description}
                    </p>
                  ) : null}
                  <p className="text-muted-foreground mt-5 flex items-center gap-2 border-t pt-4 text-sm">
                    <CalendarDays aria-hidden="true" className="size-4" />
                    Vigente hasta el{" "}
                    {formatShortDate(promotion.ends_at)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border-border bg-card mt-8 flex flex-col items-start rounded-2xl border border-dashed p-7 sm:flex-row sm:items-center sm:gap-5">
            <span className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
              <BadgePercent aria-hidden="true" className="size-5" />
            </span>
            <div className="mt-4 sm:mt-0">
              <h3 className="text-foreground font-semibold">
                Pronto encontrarás nuevas promociones
              </h3>
              <p className="text-muted-foreground mt-1 text-sm leading-6">
                Aquí aparecerán automáticamente las ofertas que estén vigentes.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
