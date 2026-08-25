"use client";

import { useActionState } from "react";

import {
  createPromotion,
  type PromotionState,
  updatePromotion,
} from "@/app/dashboard/negocios/[id]/promociones/actions";
import { Button } from "@/components/ui/button";

export type EditablePromotion = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
};

const initialState: PromotionState = { status: "idle", message: "" };
const inputClass =
  "border-input bg-background text-foreground mt-1 h-10 w-full rounded-lg border px-3 text-sm";

export function PromotionForm({
  businessId,
  promotion,
}: {
  businessId: string;
  promotion?: EditablePromotion;
}) {
  const action = promotion
    ? updatePromotion.bind(null, businessId, promotion.id)
    : createPromotion.bind(null, businessId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-4" noValidate>
      <label className="text-foreground text-sm font-medium">
        Título
        <input
          name="title"
          maxLength={140}
          required
          defaultValue={promotion?.title}
          className={inputClass}
          disabled={pending}
        />
        {state.fieldErrors?.title ? (
          <span className="text-destructive mt-1 block text-xs">
            {state.fieldErrors.title}
          </span>
        ) : null}
      </label>
      <label className="text-foreground text-sm font-medium">
        Descripción
        <textarea
          name="description"
          rows={3}
          maxLength={2000}
          defaultValue={promotion?.description ?? undefined}
          className="border-input bg-background text-foreground mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          disabled={pending}
        />
        {state.fieldErrors?.description ? (
          <span className="text-destructive mt-1 block text-xs">
            {state.fieldErrors.description}
          </span>
        ) : null}
      </label>
      <label className="text-foreground text-sm font-medium">
        URL de imagen (opcional)
        <input
          name="imageUrl"
          type="url"
          maxLength={2048}
          placeholder="https://…"
          defaultValue={promotion?.image_url ?? undefined}
          className={inputClass}
          disabled={pending}
        />
        {state.fieldErrors?.imageUrl ? (
          <span className="text-destructive mt-1 block text-xs">
            {state.fieldErrors.imageUrl}
          </span>
        ) : null}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-foreground text-sm font-medium">
          Inicia
          <input
            name="startsAt"
            type="datetime-local"
            required
            defaultValue={promotion?.starts_at}
            className={inputClass}
            disabled={pending}
          />
          {state.fieldErrors?.startsAt ? (
            <span className="text-destructive mt-1 block text-xs">
              {state.fieldErrors.startsAt}
            </span>
          ) : null}
        </label>
        <label className="text-foreground text-sm font-medium">
          Finaliza
          <input
            name="endsAt"
            type="datetime-local"
            required
            defaultValue={promotion?.ends_at}
            className={inputClass}
            disabled={pending}
          />
          {state.fieldErrors?.endsAt ? (
            <span className="text-destructive mt-1 block text-xs">
              {state.fieldErrors.endsAt}
            </span>
          ) : null}
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-foreground flex items-center gap-2 text-sm">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={promotion?.is_active ?? true}
            className="accent-primary size-4"
            disabled={pending}
          />{" "}
          Promoción activa
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : promotion ? "Guardar" : "Crear promoción"}
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">
        Las fechas se interpretan en la hora local de Colombia.
      </p>
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
