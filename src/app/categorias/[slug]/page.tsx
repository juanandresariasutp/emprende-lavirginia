import { ArrowLeft, Store } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!category) {
    notFound();
  }

  return (
    <div className="page-container py-12 sm:py-16">
      <Link
        href="/"
        className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Volver al inicio
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
        <p className="text-muted-foreground mt-8 border-t pt-6 text-sm">
          Los negocios de esta categoría aparecerán aquí en una próxima etapa.
        </p>
      </section>
    </div>
  );
}
