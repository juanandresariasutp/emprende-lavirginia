import type { Metadata } from "next";
import { Store } from "lucide-react";
import Link from "next/link";

import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Ingresar",
  description:
    "Ingresa a Emprende La Virginia para administrar la información de tu negocio.",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

function getSafeNextPath(value?: string) {
  return value?.startsWith("/") && !value.startsWith("//")
    ? value
    : "/dashboard";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = getSafeNextPath(next);

  return (
    <section className="page-container flex flex-1 items-center py-10 sm:py-16">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-sm lg:grid-cols-2">
        <div className="bg-primary text-primary-foreground flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
            <Store aria-hidden="true" className="size-6" />
          </span>
          <p className="mt-8 text-sm font-semibold tracking-wide uppercase opacity-80">
            Panel de propietarios
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Administra tu negocio desde un solo lugar
          </h1>
          <p className="mt-4 max-w-md leading-7 opacity-85">
            Ingresa para mantener actualizados tus productos, servicios,
            promociones y datos de contacto.
          </p>
        </div>

        <div className="p-7 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              Bienvenido de nuevo
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Usa el correo con el que registraste tu cuenta.
            </p>
            <div className="mt-7">
              <LoginForm nextPath={nextPath} />
            </div>
            <p className="text-muted-foreground mt-6 text-center text-sm">
              ¿Aún no tienes una cuenta?{" "}
              <Link
                href="/registro"
                className="text-primary font-semibold hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
