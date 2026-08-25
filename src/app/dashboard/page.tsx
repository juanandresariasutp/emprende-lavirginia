import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";

import { LogoutButton } from "@/components/forms/logout-button";

export const metadata: Metadata = {
  title: "Panel de propietario",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <section className="page-container flex flex-1 items-center py-12 sm:py-16">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border bg-card p-7 shadow-sm sm:p-10">
        <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
          <LayoutDashboard aria-hidden="true" className="size-6" />
        </span>
        <p className="text-primary mt-6 text-sm font-semibold tracking-wide uppercase">
          Panel de propietario
        </p>
        <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight">
          Tu espacio de administración está listo
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-7">
          En los próximos apartados construiremos aquí las herramientas para
          registrar y mantener actualizado tu negocio.
        </p>
        <div className="border-border mt-8 border-t pt-6">
          <LogoutButton />
        </div>
      </div>
    </section>
  );
}
