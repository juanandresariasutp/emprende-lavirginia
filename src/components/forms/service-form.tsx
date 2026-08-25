"use client";

import { useActionState } from "react";

import {
  createService,
  type ServiceState,
  updateService,
} from "@/app/dashboard/negocios/[id]/servicios/actions";
import { Button } from "@/components/ui/button";

export type EditableService = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  is_available: boolean;
};

const initialState: ServiceState = { status: "idle", message: "" };
const inputClass =
  "border-input bg-background text-foreground mt-1 h-10 w-full rounded-lg border px-3 text-sm";

export function ServiceForm({
  businessId,
  service,
}: {
  businessId: string;
  service?: EditableService;
}) {
  const action = service
    ? updateService.bind(null, businessId, service.id)
    : createService.bind(null, businessId);
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
            defaultValue={service?.name}
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
          Precio desde (opcional)
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={service?.price ?? undefined}
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
          defaultValue={service?.description ?? undefined}
          className="border-input bg-background text-foreground mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          disabled={pending}
        />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-foreground flex items-center gap-2 text-sm">
          <input
            name="isAvailable"
            type="checkbox"
            defaultChecked={service?.is_available ?? true}
            className="accent-primary size-4"
            disabled={pending}
          />{" "}
          Disponible
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : service ? "Guardar" : "Crear servicio"}
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
