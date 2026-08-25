"use client";

import Image from "next/image";
import { useActionState } from "react";

import {
  deleteProductImage,
  type ProductImageState,
  uploadProductImage,
} from "@/app/dashboard/negocios/[id]/productos/actions";
import { Button } from "@/components/ui/button";

const initialState: ProductImageState = { status: "idle", message: "" };

export function ProductImageForm({
  businessId,
  productId,
  currentUrl,
}: {
  businessId: string;
  productId: string;
  currentUrl?: string;
}) {
  const [state, formAction, pending] = useActionState(
    uploadProductImage.bind(null, businessId, productId),
    initialState,
  );
  const previewUrl = state.imageUrl ?? currentUrl;

  return (
    <div className="grid gap-4">
      <form action={formAction} className="grid gap-4" noValidate>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="border-border bg-muted relative size-28 shrink-0 overflow-hidden rounded-xl border">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Imagen actual del producto"
                fill
                sizes="112px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-muted-foreground flex h-full items-center justify-center p-2 text-center text-xs">
                Sin imagen
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <label
              className="text-foreground text-sm font-medium"
              htmlFor={`product-image-${productId}`}
            >
              Imagen del producto
            </label>
            <input
              id={`product-image-${productId}`}
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              disabled={pending}
              className="border-input bg-background text-foreground mt-2 block w-full rounded-lg border p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:font-medium file:text-primary"
            />
            <p className="text-muted-foreground mt-2 text-xs">
              JPG, PNG o WebP, máximo 5 MB. Se convierte a WebP de hasta
              1200×1200.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          {state.status !== "idle" ? (
            <p
              role={state.status === "error" ? "alert" : "status"}
              className={
                state.status === "error" ? "text-destructive" : "text-primary"
              }
            >
              {state.message}
            </p>
          ) : (
            <span />
          )}
          <Button type="submit" size="sm" disabled={pending}>
            {pending
              ? "Procesando…"
              : previewUrl
                ? "Reemplazar imagen"
                : "Subir imagen"}
          </Button>
        </div>
      </form>
      {previewUrl ? (
        <form
          action={deleteProductImage.bind(null, businessId, productId)}
          className="flex justify-end"
        >
          <Button type="submit" variant="destructive" size="sm">
            Eliminar imagen
          </Button>
        </form>
      ) : null}
    </div>
  );
}
