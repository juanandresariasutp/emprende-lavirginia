import type { Metadata } from "next";
import { KeyRound } from "lucide-react";
import Link from "next/link";

import { RequestPasswordResetForm } from "@/components/forms/request-password-reset-form";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false, follow: false },
};

type RecoveryPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RecoveryPage({
  searchParams,
}: RecoveryPageProps) {
  const { error } = await searchParams;

  return (
    <section className="page-container flex flex-1 items-center py-10 sm:py-16">
      <div className="mx-auto w-full max-w-lg rounded-2xl border bg-card p-7 shadow-sm sm:p-10">
        <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
          <KeyRound aria-hidden="true" className="size-6" />
        </span>
        <h1 className="text-foreground mt-6 text-3xl font-bold tracking-tight">
          Recupera tu contraseña
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Te enviaremos un enlace seguro para crear una nueva contraseña.
        </p>
        {error === "enlace-invalido" ? (
          <p
            role="alert"
            className="bg-destructive/10 text-destructive mt-5 rounded-lg p-3 text-sm"
          >
            El enlace no es válido o ya venció. Solicita uno nuevo.
          </p>
        ) : null}
        <div className="mt-7">
          <RequestPasswordResetForm />
        </div>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          ¿Recordaste tu contraseña?{" "}
          <Link
            href="/ingresar"
            className="text-primary font-semibold hover:underline"
          >
            Volver a ingresar
          </Link>
        </p>
      </div>
    </section>
  );
}
