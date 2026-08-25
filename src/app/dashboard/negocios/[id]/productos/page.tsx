import { Package, Trash2 } from "lucide-react";
import type { Metadata } from "next";

import { deleteProduct, toggleProductAvailability } from "./actions";
import {
  ProductForm,
  type EditableProduct,
} from "@/components/forms/product-form";
import { ProductImageForm } from "@/components/forms/product-image-form";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Productos",
  robots: { index: false },
};
type ProductsPageProps = { params: Promise<{ id: string }> };

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, description, price, image_url, is_available, updated_at")
    .eq("business_id", id)
    .order("created_at", { ascending: false });
  const products = (data ?? []).map((product) => ({
    ...product,
    price: Number(product.price),
  })) satisfies EditableProduct[];

  return (
    <section>
      <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
        <Package aria-hidden="true" className="size-4" /> Catálogo
      </p>
      <h1 className="text-foreground mt-2 text-3xl font-bold">Productos</h1>
      <p className="text-muted-foreground mt-3">
        Crea productos, actualiza sus datos y controla su disponibilidad.
      </p>

      <div className="border-border bg-card mt-7 rounded-2xl border p-5 shadow-sm">
        <h2 className="text-foreground mb-4 font-bold">Nuevo producto</h2>
        <ProductForm businessId={id} />
      </div>

      <div className="mt-7 grid gap-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="border-border bg-card rounded-2xl border p-5 shadow-sm"
          >
            <ProductForm businessId={id} product={product} />
            <div className="border-border mt-5 border-t pt-5">
              <ProductImageForm
                key={product.image_url ?? "without-image"}
                businessId={id}
                productId={product.id}
                currentUrl={
                  product.image_url
                    ? (/^https?:\/\//i.test(product.image_url)
                        ? product.image_url
                        : supabase.storage
                            .from("products")
                            .getPublicUrl(product.image_url).data.publicUrl) +
                      `?v=${new Date(product.updated_at).getTime()}`
                    : undefined
                }
              />
            </div>
            <div className="border-border mt-4 flex flex-wrap justify-between gap-3 border-t pt-4">
              <form
                action={toggleProductAvailability.bind(
                  null,
                  id,
                  product.id,
                  !product.is_available,
                )}
              >
                <button
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                  )}
                >
                  {product.is_available
                    ? "Marcar no disponible"
                    : "Marcar disponible"}
                </button>
              </form>
              <form action={deleteProduct.bind(null, id, product.id)}>
                <button
                  className={cn(
                    buttonVariants({ variant: "destructive", size: "sm" }),
                  )}
                >
                  <Trash2 aria-hidden="true" className="size-4" /> Eliminar
                </button>
              </form>
            </div>
          </article>
        ))}
        {products.length === 0 ? (
          <p className="border-border text-muted-foreground rounded-2xl border border-dashed p-8 text-center text-sm">
            Aún no has creado productos.
          </p>
        ) : null}
      </div>
    </section>
  );
}
