"use client";

import { useActionState } from "react";

import {
  createProduct,
  type ProductState,
  updateProduct,
} from "@/app/dashboard/negocios/[id]/productos/actions";
import { Button } from "@/components/ui/button";

export type EditableProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  updated_at: string;
  is_available: boolean;
};

const initialState: ProductState = { status: "idle", message: "" };
const inputClass =
  "border-input bg-background text-foreground mt-1 h-10 w-full rounded-lg border px-3 text-sm";

type ProductFormProps = { businessId: string; product?: EditableProduct };

export function ProductForm({ businessId, product }: ProductFormProps) {
  const action = product
    ? updateProduct.bind(null, businessId, product.id)
    : createProduct.bind(null, businessId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-[1fr_11rem]">
        <label className="text-foreground text-sm font-medium">
          Nombre
          <input
            name="name"
            maxLength={120}
            required
            defaultValue={product?.name}
            className={inputClass}
            disabled={pending}
          />
          {state.fieldErrors?.name ? (
            <span className="text-destructive mt-1 block text-xs">
              {state.fieldErrors.name}
            </span>
          ) : null}
        </label>
        <label className="text-foreground text-sm font-medium">
          Precio
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={product?.price}
            className={inputClass}
            disabled={pending}
          />
          {state.fieldErrors?.price ? (
            <span className="text-destructive mt-1 block text-xs">
              {state.fieldErrors.price}
            </span>
          ) : null}
        </label>
      </div>
      <label className="text-foreground text-sm font-medium">
        Descripción
        <textarea
          name="description"
          rows={3}
          maxLength={2000}
          defaultValue={product?.description ?? undefined}
          className="border-input bg-background text-foreground mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          disabled={pending}
        />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-foreground flex items-center gap-2 text-sm">
          <input
            name="isAvailable"
            type="checkbox"
            defaultChecked={product?.is_available ?? true}
            className="accent-primary size-4"
            disabled={pending}
          />{" "}
          Disponible
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : product ? "Guardar" : "Crear producto"}
        </Button>
      </div>
      {state.status !== "idle" ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-lg p-2 text-sm ${state.status === "error" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
