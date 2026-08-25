"use client";

import { XCircle } from "lucide-react";
import { useActionState } from "react";

import {
  rejectBusiness,
  type RejectionState,
} from "@/app/admin/negocios/actions";
import { Button } from "@/components/ui/button";

const initialState: RejectionState = { status: "idle", message: "" };

export function RejectBusinessForm({ businessId }: { businessId: string }) {
  const [state, formAction, pending] = useActionState(
    rejectBusiness.bind(null, businessId),
    initialState,
  );

  return (
    <form action={formAction} className="mt-4 grid gap-3" noValidate>
      <label className="text-foreground text-sm font-medium">
        Motivo del rechazo
        <textarea
          name="reason"
          rows={3}
          minLength={2}
          maxLength={1000}
          required
          disabled={pending}
          className="border-input bg-background text-foreground mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="Indica qué información debe corregir el propietario."
        />
        {state.fieldError ? (
          <span className="text-destructive mt-1 block text-xs">
            {state.fieldError}
          </span>
        ) : null}
      </label>
      <Button type="submit" variant="destructive" disabled={pending}>
        <XCircle aria-hidden="true" className="size-4" />
        {pending ? "Rechazando…" : "Rechazar negocio"}
      </Button>
      {state.status !== "idle" && !state.fieldError ? (
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
      ) : null}
    </form>
  );
}
