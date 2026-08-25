import { BadgeCheck, MapPin, Store } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type RecentBusiness = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  is_verified: boolean;
};

type RecentBusinessesProps = {
  businesses: RecentBusiness[];
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
            <article
              key={business.id}
              className="border-border bg-card rounded-2xl border p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                  <Store aria-hidden="true" className="size-6" />
                </span>
                {business.is_verified ? (
                  <span className="text-primary flex items-center gap-1 text-xs font-semibold">
                    <BadgeCheck aria-hidden="true" className="size-4" />
                    Verificado
                  </span>
                ) : null}
              </div>
              <h3 className="text-foreground mt-5 text-lg font-semibold text-balance">
                {business.name}
              </h3>
              {business.description ? (
                <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-6">
                  {business.description}
                </p>
              ) : null}
              <p className="text-muted-foreground mt-4 flex items-start gap-2 text-sm">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                {business.address ?? "La Virginia, Risaralda"}
              </p>
            </article>
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
