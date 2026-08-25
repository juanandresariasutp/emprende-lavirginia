import { Store } from "lucide-react";
import Link from "next/link";

import {
  BusinessCard,
  type BusinessCardData,
} from "@/components/business/business-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RecentBusinessesProps = {
  businesses: BusinessCardData[];
};

export function RecentBusinesses({ businesses }: RecentBusinessesProps) {
  return (
    <section className="page-container py-14 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          Recién llegados
        </p>
        <h2 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Nuevos negocios
        </h2>
        <p className="text-muted-foreground mt-4 leading-7">
          Conoce los emprendimientos aprobados más recientemente en la
          plataforma.
        </p>
      </div>

      {businesses.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="border-border bg-card mt-8 grid gap-6 rounded-2xl border border-dashed p-7 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
            <Store aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h3 className="text-foreground font-semibold">
              Sé parte de los primeros negocios
            </h3>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              Los perfiles aparecerán aquí cuando sean registrados y aprobados.
            </p>
          </div>
          <Link
            href="/registro"
            className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
          >
            Crear una cuenta
          </Link>
        </div>
      )}
    </section>
  );
}
