"use client";

import { Save, Trash2 } from "lucide-react";
import { useActionState } from "react";

import {
  createCategory,
  deleteCategory,
  type CategoryActionState,
  updateCategory,
} from "@/app/admin/categorias/actions";
import { Button } from "@/components/ui/button";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

const initialState: CategoryActionState = { status: "idle", message: "" };
const inputClass =
  "border-input bg-background text-foreground mt-1.5 w-full rounded-lg border px-3 py-2 text-sm";

function Feedback({ state }: { state: CategoryActionState }) {
  if (state.status === "idle") return null;
  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      className={
        state.status === "error"
          ? "text-destructive text-sm"
          : "text-primary text-sm"
      }
    >
      {state.message}
    </p>
  );
}

export function CategoryForm({ category }: { category?: Category }) {
  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-foreground text-sm font-medium">
          Nombre
          <input
            name="name"
            defaultValue={category?.name}
            minLength={2}
            maxLength={80}
            required
            disabled={pending}
            className={inputClass}
          />
        </label>
        <label className="text-foreground text-sm font-medium">
          Identificador (slug)
          <input
            name="slug"
            defaultValue={category?.slug}
            maxLength={80}
            disabled={pending}
            className={inputClass}
            placeholder="Se genera a partir del nombre"
          />
        </label>
      </div>
      <label className="text-foreground text-sm font-medium">
        Descripción
        <textarea
          name="description"
          defaultValue={category?.description ?? ""}
          rows={2}
          maxLength={500}
          disabled={pending}
          className={inputClass}
        />
      </label>
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-foreground text-sm font-medium">
          Orden
          <input
            name="sortOrder"
            type="number"
            min={0}
            max={32767}
            defaultValue={category?.sort_order ?? 0}
            required
            disabled={pending}
            className={`${inputClass} w-28`}
          />
        </label>
        <label className="text-foreground mb-2 flex items-center gap-2 text-sm font-medium">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={category?.is_active ?? true}
            disabled={pending}
            className="accent-primary size-4"
          />
          Activa en el directorio
        </label>
        <Button type="submit" disabled={pending} className="mb-1 sm:ml-auto">
          <Save aria-hidden="true" />
          {pending
            ? "Guardando…"
            : category
              ? "Guardar cambios"
              : "Crear categoría"}
        </Button>
      </div>
      <Feedback state={state} />
    </form>
  );
}

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [state, formAction, pending] = useActionState(
    deleteCategory.bind(null, categoryId),
    initialState,
  );

  return (
    <form action={formAction} className="mt-4 grid gap-2">
      <Button
        type="submit"
        variant="destructive"
        disabled={pending}
        onClick={(event) => {
          if (!window.confirm("¿Eliminar esta categoría definitivamente?")) {
            event.preventDefault();
          }
        }}
      >
        <Trash2 aria-hidden="true" />
        {pending ? "Eliminando…" : "Eliminar categoría"}
      </Button>
      <Feedback state={state} />
    </form>
  );
}
