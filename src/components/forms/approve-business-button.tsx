"use client";

import { CheckCircle2 } from "lucide-react";
import { useActionState } from "react";

import {
  approveBusiness,
  type ApprovalState,
} from "@/app/admin/negocios/actions";
import { Button } from "@/components/ui/button";

const initialState: ApprovalState = { status: "idle", message: "" };

export function ApproveBusinessButton({ businessId }: { businessId: string }) {
  const [state, formAction, pending] = useActionState(
    approveBusiness.bind(null, businessId),
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-3">
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        <CheckCircle2 aria-hidden="true" className="size-5" />
        {pending ? "Aprobando…" : "Aprobar negocio"}
      </Button>
      {state.status !== "idle" ? (
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
