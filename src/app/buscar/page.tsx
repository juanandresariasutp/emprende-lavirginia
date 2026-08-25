import { Search, Store } from "lucide-react";
import type { Metadata } from "next";

import {
  BusinessCard,
  type BusinessCardData,
} from "@/components/business/business-card";
import { buttonVariants } from "@/components/ui/button";
import { isBusinessOpenNow } from "@/lib/business-hours";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Buscar",
  description:
    "Busca negocios, productos, servicios y categorías de La Virginia.",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

function normalizeQuery(value: string | string[] | undefined) {
  const query = Array.isArray(value) ? value[0] : value;
  return query?.trim().replace(/[%_]/g, "").slice(0, 100) ?? "";
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = normalizeQuery(params.q);
  const canSearch = query.length >= 2;
  const supabase = await createClient();
  let businesses: BusinessCardData[] = [];

  if (canSearch) {
    const pattern = `%${query}%`;
    const [businessMatches, productMatches, serviceMatches, categoryMatches] =
      await Promise.all([
        supabase
          .from("businesses")
          .select("id")
          .eq("status", "approved")
          .or(`name.ilike.${pattern},description.ilike.${pattern}`),
        supabase
          .from("products")
          .select("business_id")
          .eq("is_available", true)
          .or(`name.ilike.${pattern},description.ilike.${pattern}`),
        supabase
          .from("services")
          .select("business_id")
          .eq("is_available", true)
          .or(`name.ilike.${pattern},description.ilike.${pattern}`),
        supabase
          .from("categories")
          .select("business_categories(business_id)")
          .eq("is_active", true)
          .or(`name.ilike.${pattern},description.ilike.${pattern}`),
      ]);

    const businessIds = new Set<string>();
    businessMatches.data?.forEach(({ id }) => businessIds.add(id));
    productMatches.data?.forEach(({ business_id }) =>
      businessIds.add(business_id),
    );
    serviceMatches.data?.forEach(({ business_id }) =>
      businessIds.add(business_id),
    );
    categoryMatches.data?.forEach(({ business_categories }) =>
      business_categories.forEach(({ business_id }) =>
        businessIds.add(business_id),
      ),
    );

    if (businessIds.size > 0) {
      const { data } = await supabase
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
        .in("id", [...businessIds])
        .eq("status", "approved")
        .order("name", { ascending: true });

      businesses = (data ?? []).map((business) => {
        const logo = business.business_images.find(
          (image) => image.image_type === "logo",
        );
        const primaryCategory =
          business.business_categories.find((item) => item.is_primary) ??
          business.business_categories[0];

        return {
          id: business.id,
          name: business.name,
          slug: business.slug,
          address: business.address,
          logoUrl: logo
            ? supabase.storage
                .from("business-logos")
                .getPublicUrl(logo.storage_path).data.publicUrl
            : null,
          category: primaryCategory?.categories[0]?.name ?? null,
          isOpen: isBusinessOpenNow(business.business_hours),
        };
      });
    }
  }

  return (
    <main className="page-container py-12 sm:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          Directorio local
        </p>
        <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Encuentra lo que necesitas
        </h1>
        <p className="text-muted-foreground mt-4 leading-7">
          Busca por negocio, producto, servicio o categoría.
        </p>

        <form
          action="/buscar"
          method="get"
          role="search"
          className="border-border bg-card mt-7 flex gap-2 rounded-2xl border p-2 shadow-sm"
        >
          <label htmlFor="directory-search" className="sr-only">
            Buscar en el directorio
          </label>
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="text-muted-foreground absolute top-1/2 left-3.5 size-5 -translate-y-1/2"
            />
            <input
              id="directory-search"
              name="q"
              type="search"
              defaultValue={query}
              minLength={2}
              maxLength={100}
              required
              autoFocus
              autoComplete="off"
              placeholder="Ej. panadería, almuerzos o reparación"
              className="text-foreground placeholder:text-muted-foreground focus:ring-ring/30 h-12 w-full rounded-xl bg-transparent pr-4 pl-11 outline-none focus:ring-3"
            />
          </div>
          <button
            type="submit"
            className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-xl")}
          >
            Buscar
          </button>
        </form>
      </div>

      {canSearch ? (
        <section className="mt-12" aria-labelledby="search-results-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2
                id="search-results-title"
                className="text-foreground text-2xl font-bold"
              >
                Resultados para “{query}”
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {businesses.length === 1
                  ? "1 negocio encontrado"
                  : `${businesses.length} negocios encontrados`}
              </p>
            </div>
          </div>

          {businesses.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          ) : (
            <div className="border-border bg-card mt-6 flex flex-col items-center rounded-2xl border border-dashed px-6 py-12 text-center">
              <span className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-xl">
                <Store aria-hidden="true" className="size-6" />
              </span>
              <h3 className="text-foreground mt-4 font-semibold">
                No encontramos coincidencias
              </h3>
              <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
                Prueba con otro nombre, producto, servicio o una categoría más
                general.
              </p>
            </div>
          )}
        </section>
      ) : (
        <p className="text-muted-foreground mt-10 text-center text-sm">
          Escribe al menos dos caracteres para comenzar la búsqueda.
        </p>
      )}
    </main>
  );
}
