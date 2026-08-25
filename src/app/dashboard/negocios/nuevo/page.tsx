import { Building2 } from "lucide-react";
import type { Metadata } from "next";

import { CreateBusinessForm } from "@/components/forms/create-business-form";

export const metadata: Metadata = {
  title: "Crear negocio",
  robots: { index: false, follow: false },
};

export default function NewBusinessPage() {
  return (
    <section>
      <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
        <Building2 aria-hidden="true" className="size-4" />
        Nuevo negocio
      </p>
      <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight">
        Registra tu negocio
      </h1>
      <p className="text-muted-foreground mt-3 max-w-3xl leading-7">
        Completa la información principal. El perfil quedará pendiente de
        revisión antes de aparecer públicamente.
      </p>

      <div className="border-border bg-card mt-7 rounded-2xl border p-5 shadow-sm sm:p-7">
        <CreateBusinessForm />
      </div>
    </section>
  );
}
