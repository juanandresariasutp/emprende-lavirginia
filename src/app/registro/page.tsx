import type { Metadata } from "next";
import { Check, Store } from "lucide-react";
import Link from "next/link";

import { RegisterOwnerForm } from "@/components/forms/register-owner-form";
import { getTurnstileSiteKey } from "@/lib/security/turnstile";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Crea una cuenta de propietario para registrar tu negocio en Emprende La Virginia.",
};

const benefits = [
  "Publica la información de tu negocio.",
  "Agrega productos, servicios y promociones.",
  "Mantén tus horarios y datos de contacto actualizados.",
];

export default function RegisterPage() {
  const turnstileSiteKey = getTurnstileSiteKey();

  return (
    <section className="page-container flex flex-1 items-center py-10 sm:py-16">
      <div className="grid w-full overflow-hidden rounded-2xl border bg-card shadow-sm lg:grid-cols-[0.85fr_1.15fr]">
        <div className="bg-primary text-primary-foreground p-7 sm:p-10 lg:p-12">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
            <Store aria-hidden="true" className="size-6" />
          </span>
          <p className="mt-8 text-sm font-semibold tracking-wide uppercase opacity-80">
            Para emprendedores
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Haz visible tu negocio en La Virginia
          </h1>
          <p className="mt-4 max-w-md leading-7 opacity-85">
            Crea tu cuenta de propietario. Después podrás completar el perfil de
            tu negocio y enviarlo a revisión.
          </p>
          <ul className="mt-8 space-y-4">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 text-sm leading-6"
              >
                <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-7 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-xl">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">
              Crea tu cuenta
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Todos los campos son necesarios para comenzar.
            </p>
            <div className="mt-7">
              <RegisterOwnerForm siteKey={turnstileSiteKey} />
            </div>
            <p className="text-muted-foreground mt-6 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/ingresar"
                className="text-primary font-semibold hover:underline"
              >
                Ingresa aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
