import { Building2, ChevronRight, Clock3 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Negocios pendientes",
  robots: { index: false, follow: false },
};

export default async function PendingBusinessesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("businesses")
    .select("id, name, description, address, created_at, owner_id")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  const businesses = data ?? [];

  const ownerIds = [
    ...new Set(businesses.map((business) => business.owner_id)),
  ];
  const { data: owners } = ownerIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", ownerIds)
    : { data: [] };
  const ownerNames = new Map(
    (owners ?? []).map((owner) => [owner.id, owner.full_name]),
  );

  return (
    <section>
      <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
        <Clock3 aria-hidden="true" className="size-4" /> Moderación
      </p>
      <h1 className="text-foreground mt-2 text-3xl font-bold">
        Negocios pendientes
      </h1>
      <p className="text-muted-foreground mt-3">
        Revisa primero las solicitudes más antiguas. Hay {businesses.length} en
        espera.
      </p>

      <div className="mt-7 grid gap-4">
        {businesses.map((business) => (
          <Link
            key={business.id}
            href={`/admin/negocios/${business.id}`}
            className="border-border bg-card hover:border-primary/40 focus-visible:ring-ring group rounded-2xl border p-5 shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Building2
                    aria-hidden="true"
                    className="text-primary size-5"
                  />
                  <h2 className="text-foreground truncate text-lg font-bold">
                    {business.name}
                  </h2>
                </div>
                <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-6">
                  {business.description || "Sin descripción."}
                </p>
                <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                  <span>
                    Propietario:{" "}
                    {ownerNames.get(business.owner_id) || "Sin nombre"}
                  </span>
                  <span>{business.address || "Sin dirección"}</span>
                  <span>
                    Recibido:{" "}
                    {new Intl.DateTimeFormat("es-CO", {
                      dateStyle: "medium",
                    }).format(new Date(business.created_at))}
                  </span>
                </div>
              </div>
              <ChevronRight
                aria-hidden="true"
                className="text-muted-foreground group-hover:text-primary mt-1 size-5 shrink-0"
              />
            </div>
          </Link>
        ))}

        {businesses.length === 0 ? (
          <div className="border-border text-muted-foreground rounded-2xl border border-dashed p-10 text-center">
            No hay negocios pendientes de revisión.
          </div>
        ) : null}
      </div>
    </section>
  );
}
