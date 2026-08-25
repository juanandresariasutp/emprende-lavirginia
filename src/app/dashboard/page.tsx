import type { Metadata } from "next";
import {
  ArrowRight,
  Box,
  Building2,
  CircleCheck,
  Clock3,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Panel de propietario",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  pending: "Pendiente de revisión",
  approved: "Aprobado",
  rejected: "Requiere cambios",
  suspended: "Suspendido",
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  suspended: "bg-slate-200 text-slate-700",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const ownerId = claimsData?.claims?.sub;

  if (!ownerId) redirect("/ingresar?next=/dashboard");

  const [{ data: profile }, { data: businesses }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", ownerId)
      .maybeSingle(),
    supabase
      .from("businesses")
      .select("id, name, slug, status, updated_at")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false }),
  ]);

  const businessIds = (businesses ?? []).map((business) => business.id);
  let productCount = 0;
  let serviceCount = 0;

  if (businessIds.length > 0) {
    const [products, services] = await Promise.all([
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .in("business_id", businessIds),
      supabase
        .from("services")
        .select("id", { count: "exact", head: true })
        .in("business_id", businessIds),
    ]);
    productCount = products.count ?? 0;
    serviceCount = services.count ?? 0;
  }

  const summary = [
    {
      label: "Negocios",
      value: businesses?.length ?? 0,
      icon: Building2,
    },
    { label: "Productos", value: productCount, icon: Box },
    { label: "Servicios", value: serviceCount, icon: Wrench },
  ];

  return (
    <section>
      <p className="text-primary text-sm font-semibold tracking-wide uppercase">
        Panel de propietario
      </p>
      <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight">
        {profile?.full_name
          ? `Hola, ${profile.full_name}`
          : "Resumen de tu cuenta"}
      </h1>
      <p className="text-muted-foreground mt-3 leading-7">
        Consulta el estado de tus negocios y administra su información desde un
        solo lugar.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.label}
              className="border-border bg-card rounded-2xl border p-5 shadow-sm"
            >
              <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <strong className="text-foreground mt-4 block text-3xl">
                {item.value}
              </strong>
              <span className="text-muted-foreground text-sm">
                {item.label}
              </span>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-foreground text-xl font-bold">Tus negocios</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Revisa el estado de publicación de cada perfil.
          </p>
        </div>
        <Link
          href="/dashboard/negocios/nuevo"
          className={cn(buttonVariants(), "shrink-0")}
        >
          Crear negocio
        </Link>
      </div>

      {(businesses ?? []).length > 0 ? (
        <div className="mt-4 grid gap-4">
          {(businesses ?? []).map((business) => (
            <article
              key={business.id}
              className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <span className="bg-muted text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                {business.status === "approved" ? (
                  <CircleCheck aria-hidden="true" className="size-5" />
                ) : (
                  <Clock3 aria-hidden="true" className="size-5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-foreground truncate font-bold">
                  {business.name}
                </h3>
                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[business.status] ?? statusStyles.pending}`}
                >
                  {statusLabels[business.status] ?? business.status}
                </span>
              </div>
              <Link
                href={`/dashboard/negocios/${business.id}/editar`}
                className="text-primary inline-flex items-center gap-2 text-sm font-semibold"
              >
                Administrar
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="border-border bg-card mt-4 rounded-2xl border border-dashed p-8 text-center">
          <Building2
            aria-hidden="true"
            className="text-muted-foreground mx-auto size-8"
          />
          <h3 className="text-foreground mt-4 font-semibold">
            Aún no tienes un negocio registrado
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Crea tu perfil comercial para iniciar el proceso de revisión.
          </p>
        </div>
      )}
    </section>
  );
}
