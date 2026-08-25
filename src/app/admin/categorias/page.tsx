import { Tags } from "lucide-react";
import type { Metadata } from "next";

import {
  CategoryForm,
  DeleteCategoryButton,
} from "@/components/forms/category-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Administrar categorías",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description, is_active, sort_order")
    .order("sort_order")
    .order("name");

  return (
    <section>
      <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
        <Tags aria-hidden="true" className="size-4" /> Administración
      </p>
      <h1 className="text-foreground mt-2 text-3xl font-bold">Categorías</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Organiza las categorías visibles y su orden en el directorio.
      </p>

      <article className="border-border bg-card mt-7 rounded-2xl border p-6 shadow-sm">
        <h2 className="text-foreground text-xl font-bold">Nueva categoría</h2>
        <div className="mt-5">
          <CategoryForm />
        </div>
      </article>

      <div className="mt-6 grid gap-5">
        {(categories ?? []).map((category) => (
          <article
            key={category.id}
            className="border-border bg-card rounded-2xl border p-6 shadow-sm"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-foreground text-xl font-bold">
                {category.name}
              </h2>
              <span
                className={
                  category.is_active
                    ? "bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold"
                    : "bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-semibold"
                }
              >
                {category.is_active ? "Activa" : "Inactiva"}
              </span>
            </div>
            <CategoryForm category={category} />
            <div className="border-border mt-5 border-t pt-1">
              <DeleteCategoryButton categoryId={category.id} />
            </div>
          </article>
        ))}
        {(categories ?? []).length === 0 ? (
          <p className="border-border text-muted-foreground rounded-2xl border border-dashed p-8 text-center">
            Todavía no hay categorías.
          </p>
        ) : null}
      </div>
    </section>
  );
}
