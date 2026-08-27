import { BarChart3, Eye, MessageCircle, Package } from "lucide-react";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Estadísticas",
  robots: { index: false },
};

type StatisticsPageProps = { params: Promise<{ id: string }> };

function rank(ids: Array<string | null>) {
  const totals = new Map<string, number>();
  for (const id of ids) {
    if (id) totals.set(id, (totals.get(id) ?? 0) + 1);
  }
  return [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
}

export default async function StatisticsPage({ params }: StatisticsPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("business_events")
    .select("event_type, product_id")
    .eq("business_id", id);

  const allEvents = events ?? [];
  const visits = allEvents.filter(
    (event) => event.event_type === "profile_view",
  ).length;
  const whatsappClicks = allEvents.filter(
    (event) => event.event_type === "whatsapp_click",
  ).length;
  const productRanking = rank(
    allEvents
      .filter((event) => event.event_type === "product_view")
      .map((event) => event.product_id),
  );
  const productsResult = productRanking.length
    ? await supabase
        .from("products")
        .select("id, name")
        .eq("business_id", id)
        .in(
          "id",
          productRanking.map(([productId]) => productId),
        )
    : { data: [] };
  const productNames = new Map(
    (productsResult.data ?? []).map((product) => [product.id, product.name]),
  );

  const summary = [
    { label: "Visitas al perfil", value: visits, icon: Eye },
    {
      label: "Clics en WhatsApp",
      value: whatsappClicks,
      icon: MessageCircle,
    },
  ];

  return (
    <section>
      <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
        <BarChart3 aria-hidden="true" className="size-4" /> Histórico
      </p>
      <h1 className="text-foreground mt-2 text-3xl font-bold">Estadísticas</h1>
      <p className="text-muted-foreground mt-3">
        Conoce cómo las personas interactúan con el perfil público de tu
        negocio.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.label}
              className="border-border bg-card rounded-2xl border p-6 shadow-sm"
            >
              <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <strong className="text-foreground mt-4 block text-4xl">
                {item.value.toLocaleString("es-CO")}
              </strong>
              <span className="text-muted-foreground text-sm">
                {item.label}
              </span>
            </article>
          );
        })}
      </div>

      <div className="mt-6 max-w-2xl">
        <Ranking
          title="Productos más vistos"
          icon={Package}
          rows={productRanking.map(([itemId, total]) => ({
            id: itemId,
            name: productNames.get(itemId) ?? "Producto eliminado",
            total,
          }))}
        />
      </div>
    </section>
  );
}

function Ranking({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: typeof Package;
  rows: Array<{ id: string; name: string; total: number }>;
}) {
  return (
    <article className="border-border bg-card rounded-2xl border p-6 shadow-sm">
      <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
        <Icon aria-hidden="true" className="text-primary size-5" /> {title}
      </h2>
      {rows.length > 0 ? (
        <ol className="mt-5 grid gap-3">
          {rows.map((row, index) => (
            <li
              key={row.id}
              className="border-border flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0"
            >
              <span className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-full text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
                {row.name}
              </span>
              <strong className="text-primary text-sm">
                {row.total.toLocaleString("es-CO")}
              </strong>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-muted-foreground mt-5 text-sm">
          Todavía no hay visualizaciones registradas.
        </p>
      )}
    </article>
  );
}
