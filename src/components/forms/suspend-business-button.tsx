"use client";

import { Ban } from "lucide-react";
import { useActionState } from "react";

import {
  suspendBusiness,
  type ApprovalState,
} from "@/app/admin/negocios/actions";
import { Button } from "@/components/ui/button";

const initialState: ApprovalState = { status: "idle", message: "" };

export function SuspendBusinessButton({ businessId }: { businessId: string }) {
  const [state, formAction, pending] = useActionState(
    suspendBusiness.bind(null, businessId),
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-3">
      <Button type="submit" variant="destructive" size="lg" disabled={pending}>
        <Ban aria-hidden="true" className="size-5" />
        {pending ? "Suspendiendo…" : "Suspender negocio"}
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
