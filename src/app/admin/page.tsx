import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { LogoutButton } from "@/components/forms/logout-button";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <section className="page-container flex flex-1 items-center py-12 sm:py-16">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border bg-card p-7 shadow-sm sm:p-10">
        <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
          <ShieldCheck aria-hidden="true" className="size-6" />
        </span>
        <p className="text-primary mt-6 text-sm font-semibold tracking-wide uppercase">
          Acceso administrativo
        </p>
        <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight">
          Panel de administración
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-7">
          Esta ruta está reservada para administradores. Las herramientas de
          moderación se incorporarán en los apartados correspondientes.
        </p>
        <div className="border-border mt-8 border-t pt-6">
          <LogoutButton />
        </div>
      </div>
    </section>
  );
}
