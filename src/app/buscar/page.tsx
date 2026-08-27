import {
  BadgePercent,
  Clock3,
  Search,
  SlidersHorizontal,
  Store,
} from "lucide-react";
import type { Metadata } from "next";

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
  title: "Buscar",
  description:
    "Busca negocios, productos, servicios y categorías de La Virginia.",
  alternates: { canonical: "/buscar" },
};

type SearchPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    categoria?: string | string[];
    abierto?: string | string[];
    promociones?: string | string[];
  }>;
};

type SearchMatch = {
  business_id: string;
  rank: number;
};

function normalizeQuery(value: string | string[] | undefined) {
  const query = Array.isArray(value) ? value[0] : value;
  return query?.trim().replace(/[%_]/g, "").slice(0, 100) ?? "";
}

function normalizeSlug(value: string | string[] | undefined) {
  const slug = Array.isArray(value) ? value[0] : value;
  return slug?.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)?.[0] ?? "";
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = normalizeQuery(params.q);
  const categorySlug = normalizeSlug(params.categoria);
  const openNow = params.abierto === "ahora";
  const hasPromotions = params.promociones === "activas";
  const canSearch =
    query.length >= 2 || categorySlug.length > 0 || openNow || hasPromotions;
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  let businesses: BusinessCardData[] = [];

  if (canSearch) {
    const { data } = await supabase.rpc("search_businesses", {
      p_query: query,
      p_category_slug: categorySlug || null,
      p_open_now: openNow,
      p_has_promotions: hasPromotions,
    });
    const matches = (data ?? []) as SearchMatch[];
    const businessIds = matches.map(({ business_id }) => business_id);
    const relevance = new Map(
      matches.map(({ business_id, rank }) => [business_id, rank]),
    );

    if (businessIds.length > 0) {
      const { data: businessRows } = await supabase
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
        .in("id", businessIds)
        .eq("status", "approved");

      businesses = (businessRows ?? [])
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
        .sort(
          (a, b) => (relevance.get(b.id) ?? 0) - (relevance.get(a.id) ?? 0),
        );
    }
  }

  return (
    <div className="page-container py-12 sm:py-16">
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
      </div>

      <form
        action="/buscar"
        method="get"
        role="search"
        className="border-border bg-card mx-auto mt-7 grid max-w-5xl gap-2 rounded-2xl border p-2 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto]"
      >
        <label htmlFor="directory-search" className="sr-only">
          Buscar en el directorio
        </label>
        <div className="relative min-w-0">
          <Search
            aria-hidden="true"
            className="text-muted-foreground absolute top-1/2 left-3.5 size-5 -translate-y-1/2"
          />
          <input
            id="directory-search"
            name="q"
            type="search"
            defaultValue={query}
            maxLength={100}
            autoComplete="off"
            placeholder="Ej. panadería, almuerzos o reparación"
            className="text-foreground placeholder:text-muted-foreground focus:ring-ring/30 h-12 w-full rounded-xl bg-transparent pr-4 pl-11 outline-none focus:ring-3"
          />
        </div>
        <button
          type="submit"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 rounded-xl px-6 lg:min-w-28",
          )}
        >
          Buscar
        </button>

        <fieldset className="border-border grid min-w-0 gap-2 border-t pt-2 sm:grid-cols-3 lg:col-span-2">
          <legend className="sr-only">Filtros de búsqueda</legend>
          <label className="border-border text-foreground flex h-12 cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm whitespace-nowrap">
            <input
              type="checkbox"
              name="abierto"
              value="ahora"
              defaultChecked={openNow}
              className="accent-primary size-4"
            />
            <Clock3 aria-hidden="true" className="text-primary size-4" />
            Abierto ahora
          </label>
          <label className="border-border text-foreground flex h-12 cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm whitespace-nowrap">
            <input
              type="checkbox"
              name="promociones"
              value="activas"
              defaultChecked={hasPromotions}
              className="accent-primary size-4"
            />
            <BadgePercent aria-hidden="true" className="text-primary size-4" />
            Con promociones
          </label>
          <label className="relative">
            <span className="sr-only">Filtrar por categoría</span>
            <SlidersHorizontal
              aria-hidden="true"
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            />
            <select
              name="categoria"
              defaultValue={categorySlug}
              className="border-border bg-background text-foreground focus:ring-ring/30 h-12 w-full appearance-none rounded-xl border pr-8 pl-9 text-sm outline-none focus:ring-3"
            >
              <option value="">Todas las categorías</option>
              {(categories ?? []).map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
      </form>

      {canSearch ? (
        <section className="mt-12" aria-labelledby="search-results-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2
                id="search-results-title"
                className="text-foreground text-2xl font-bold"
              >
                {query ? `Resultados para “${query}”` : "Negocios encontrados"}
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
          Escribe al menos dos caracteres o utiliza uno de los filtros para
          comenzar.
        </p>
      )}
    </div>
  );
}
