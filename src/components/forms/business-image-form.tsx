"use client";

import Image from "next/image";
import { useActionState } from "react";

import {
  type BusinessImageState,
  uploadBusinessLogo,
} from "@/app/dashboard/negocios/[id]/imagenes/actions";
import { Button } from "@/components/ui/button";

const initialState: BusinessImageState = { status: "idle", message: "" };

export function BusinessLogoForm({
  businessId,
  currentUrl,
}: {
  businessId: string;
  currentUrl?: string;
}) {
  const [state, formAction, pending] = useActionState(
    uploadBusinessLogo.bind(null, businessId),
    initialState,
  );
  const previewUrl = state.imageUrl ?? currentUrl;

  return (
    <form action={formAction} className="grid gap-4" noValidate>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="border-border bg-muted relative size-28 shrink-0 overflow-hidden rounded-2xl border">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Logo actual del negocio"
              fill
              sizes="112px"
              className="object-contain p-2"
              unoptimized
            />
          ) : (
            <span className="text-muted-foreground flex h-full items-center justify-center p-3 text-center text-xs">
              Sin logo
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <label className="text-foreground text-sm font-medium" htmlFor="logo">
            Archivo del logo
          </label>
          <input
            id="logo"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            disabled={pending}
            className="border-input bg-background text-foreground mt-2 block w-full rounded-lg border p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:font-medium file:text-primary"
          />
          <p className="text-muted-foreground mt-2 text-xs">
            JPG, PNG o WebP, máximo 2 MB. Se optimiza automáticamente a WebP.
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
        <Button type="submit" disabled={pending}>
          {pending ? "Procesando…" : "Subir logo"}
        </Button>
      </div>
    </form>
  );
}
