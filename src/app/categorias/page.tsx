import { ArrowRight, Store, Tags } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Categorías",
  description:
    "Explora los negocios de La Virginia por categoría comercial.",
  alternates: { canonical: "/categorias" },
};

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div className="page-container py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          Explora lo local
        </p>
        <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          Categorías
        </h1>
        <p className="text-muted-foreground mt-4 text-lg leading-8">
          Encuentra rápidamente los productos, servicios y emprendimientos que
          necesitas en La Virginia.
        </p>
      </div>

      {error ? (
        <p role="alert" className="text-destructive mt-8 rounded-2xl border p-6">
          No fue posible cargar las categorías. Intenta nuevamente.
        </p>
      ) : categories && categories.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="border-border bg-card hover:border-primary/35 focus-visible:ring-ring group rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                <Tags aria-hidden="true" className="size-5" />
              </span>
              <h2 className="text-foreground mt-5 text-xl font-bold">
                {category.name}
              </h2>
              <p className="text-muted-foreground mt-2 min-h-12 text-sm leading-6">
                {category.description ??
                  "Descubre los negocios disponibles en esta categoría."}
              </p>
              <span className="text-primary mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                Ver negocios
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border-border bg-card mt-8 rounded-2xl border border-dashed p-8 text-center">
          <Store aria-hidden="true" className="text-primary mx-auto size-10" />
          <h2 className="text-foreground mt-4 text-xl font-bold">
            Aún no hay categorías publicadas
          </h2>
        </div>
      )}
    </div>
  );
}
