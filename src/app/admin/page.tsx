import { Building2, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const [pending, approved, total] = await Promise.all([
    supabase
      .from("businesses")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("businesses")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase.from("businesses").select("id", { count: "exact", head: true }),
  ]);

  const summaries = [
    { label: "Pendientes", value: pending.count ?? 0, icon: Clock3 },
    { label: "Aprobados", value: approved.count ?? 0, icon: CheckCircle2 },
    { label: "Total de negocios", value: total.count ?? 0, icon: Building2 },
  ];

  return (
    <section>
      <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
        <ShieldCheck aria-hidden="true" className="size-4" /> Administración
      </p>
      <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight">
        Panel de administración
      </h1>
      <p className="text-muted-foreground mt-3 max-w-3xl leading-7">
        Revisa las solicitudes y controla el contenido publicado en el
        directorio.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {summaries.map((summary) => {
          const Icon = summary.icon;
          return (
            <article
              key={summary.label}
              className="border-border bg-card rounded-2xl border p-5 shadow-sm"
            >
              <Icon aria-hidden="true" className="text-primary size-5" />
              <p className="text-foreground mt-4 text-3xl font-bold">
                {summary.value}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {summary.label}
              </p>
            </article>
          );
        })}
      </div>

      <div className="border-border bg-card mt-7 rounded-2xl border p-6 shadow-sm">
        <h2 className="text-foreground text-xl font-bold">Cola de revisión</h2>
        <p className="text-muted-foreground mt-2 mb-5 text-sm">
          Hay {pending.count ?? 0} negocios esperando una decisión.
        </p>
        <Link
          href="/admin/negocios"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Revisar pendientes
        </Link>
      </div>
    </section>
  );
}
