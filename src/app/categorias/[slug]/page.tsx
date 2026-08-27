import { ArrowLeft, Store } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  BusinessCard,
  type BusinessCardData,
} from "@/components/business/business-card";
import { isBusinessOpenNow } from "@/lib/business-hours";
import { createClient } from "@/lib/supabase/server";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    alternates: { canonical: `/categorias/${slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("id, name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!category) {
    notFound();
  }

  const { data: businessRows, error: businessesError } = await supabase
    .from("businesses")
    .select(
      `
      id,
      name,
      slug,
      address,
      business_hours(day_of_week, opens_at, closes_at, is_closed),
      business_images(storage_path, image_type),
      business_categories!inner(category_id, is_primary, categories(name))
    `,
    )
    .eq("status", "approved")
    .eq("business_categories.category_id", category.id)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  const businesses: BusinessCardData[] = (businessRows ?? []).map(
    (business) => {
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
        category: primaryCategory?.categories[0]?.name ?? category.name,
        isOpen: isBusinessOpenNow(business.business_hours),
      };
    },
  );

  return (
    <div className="page-container py-12 sm:py-16">
      <Link
        href="/categorias"
        className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Volver a categorías
      </Link>

      <section className="border-border bg-card mt-8 rounded-3xl border p-7 sm:p-10">
        <span className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-2xl">
          <Store aria-hidden="true" className="size-7" />
        </span>
        <p className="text-primary mt-7 text-sm font-semibold tracking-wide uppercase">
          Categoría
        </p>
        <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          {category.name}
        </h1>
        {category.description ? (
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-8">
            {category.description}
          </p>
        ) : null}
      </section>

      <section className="mt-10" aria-labelledby="category-businesses-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2
            id="category-businesses-title"
            className="text-foreground text-2xl font-bold"
          >
            Negocios en {category.name}
          </h2>
          <span className="text-muted-foreground text-sm">
            {businesses.length} {businesses.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>

        {businessesError ? (
          <p role="alert" className="text-destructive mt-6 rounded-2xl border p-6">
            No fue posible cargar los negocios. Intenta nuevamente.
          </p>
        ) : businesses.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <p className="border-border text-muted-foreground mt-6 rounded-2xl border border-dashed p-8 text-center text-sm">
            Aún no hay negocios aprobados en esta categoría.
          </p>
        )}
      </section>
    </div>
  );
}
