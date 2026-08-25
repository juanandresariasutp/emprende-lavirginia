import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { UpdatePasswordForm } from "@/components/forms/update-password-form";

export const metadata: Metadata = {
  title: "Crear nueva contraseña",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function UpdatePasswordPage() {
  return (
    <section className="page-container flex flex-1 items-center py-10 sm:py-16">
      <div className="mx-auto w-full max-w-lg rounded-2xl border bg-card p-7 shadow-sm sm:p-10">
        <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
          <ShieldCheck aria-hidden="true" className="size-6" />
        </span>
        <h1 className="text-foreground mt-6 text-3xl font-bold tracking-tight">
          Crea una nueva contraseña
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Elige una contraseña nueva y distinta para proteger tu cuenta.
        </p>
        <div className="mt-7">
          <UpdatePasswordForm />
        </div>
      </div>
    </section>
  );
}
