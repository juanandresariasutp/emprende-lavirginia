import { Search, Store } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import {
  BusinessCard,
  type BusinessCardData,
} from "@/components/business/business-card";
import { buttonVariants } from "@/components/ui/button";
import { getBusinessCardImages } from "@/lib/business-image";
import { isBusinessOpenNow } from "@/lib/business-hours";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Negocios locales",
  description:
    "Explora los negocios y emprendimientos aprobados de La Virginia, Risaralda.",
  alternates: { canonical: "/negocios" },
};

type BusinessesPageProps = {
  searchParams: Promise<{ abierto?: string | string[] }>;
};

export default async function BusinessesPage({
  searchParams,
}: BusinessesPageProps) {
  const params = await searchParams;
  const openNow = params.abierto === "ahora";
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(
      `
      id,
      name,
      slug,
      address,
      business_hours(day_of_week, opens_at, closes_at, is_closed),
      business_images(storage_path, image_type),
      business_categories(is_primary, categories(name))
    `,
    )
    .eq("status", "approved")
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  const businesses: BusinessCardData[] = (data ?? [])
    .map((business) => {
      const primaryCategory =
        business.business_categories.find((item) => item.is_primary) ??
        business.business_categories[0];

      return {
        id: business.id,
        name: business.name,
        slug: business.slug,
        address: business.address,
        ...getBusinessCardImages(supabase, business.business_images),
        category: primaryCategory?.categories[0]?.name ?? null,
        isOpen: isBusinessOpenNow(business.business_hours),
      };
    })
    .filter((business) => !openNow || business.isOpen);

  return (
    <div className="page-container py-12 sm:py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            Directorio local
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            Negocios de La Virginia
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-8">
            Conoce comercios y emprendimientos aprobados, revisa lo que ofrecen
            y comunícate directamente con ellos.
          </p>
        </div>
        <Link
          href="/buscar"
          className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
        >
          <Search aria-hidden="true" /> Buscar y filtrar
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/negocios"
          className={cn(
            buttonVariants({ variant: openNow ? "outline" : "default" }),
          )}
        >
          Todos
        </Link>
        <Link
          href="/negocios?abierto=ahora"
          className={cn(
            buttonVariants({ variant: openNow ? "default" : "outline" }),
          )}
        >
          Abiertos ahora
        </Link>
        <span className="text-muted-foreground text-sm" aria-live="polite">
          {businesses.length} {businesses.length === 1 ? "negocio" : "negocios"}
        </span>
      </div>

      {error ? (
        <p
          role="alert"
          className="text-destructive mt-8 rounded-2xl border p-6"
        >
          No fue posible cargar los negocios. Intenta nuevamente.
        </p>
      ) : businesses.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="border-border bg-card mt-8 rounded-2xl border border-dashed p-8 text-center">
          <Store aria-hidden="true" className="text-primary mx-auto size-10" />
          <h2 className="text-foreground mt-4 text-xl font-bold">
            {openNow
              ? "No hay negocios abiertos ahora"
              : "Aún no hay negocios publicados"}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {openNow
              ? "Consulta nuevamente más tarde o explora el directorio completo."
              : "Los negocios aparecerán aquí cuando sean aprobados."}
          </p>
        </div>
      )}
    </div>
  );
}
