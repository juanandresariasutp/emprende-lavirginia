"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
  updatePassword,
  type UpdatePasswordState,
} from "@/app/actualizar-contrasena/actions";
import { Button } from "@/components/ui/button";

const inputClassName =
  "border-input bg-background text-foreground focus:border-ring focus:ring-ring/30 h-11 w-full rounded-lg border px-3 text-sm outline-none transition-shadow focus:ring-3 disabled:cursor-not-allowed disabled:opacity-60";

const initialUpdatePasswordState: UpdatePasswordState = {
  status: "idle",
  message: "",
};

export function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePassword,
    initialUpdatePasswordState,
  );

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="border-primary/25 bg-primary/5 rounded-xl border p-5"
      >
        <h2 className="text-foreground font-semibold">
          Contraseña actualizada
        </h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          {state.message}
        </p>
        <Link
          href="/ingresar"
          className="text-primary mt-4 inline-block text-sm font-semibold hover:underline"
        >
          Ir al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="password"
          className="text-foreground text-sm font-medium"
        >
          Nueva contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
          aria-invalid={Boolean(state.fieldErrors?.password)}
          aria-describedby={
            state.fieldErrors?.password ? "password-error" : "password-help"
          }
          className={`${inputClassName} mt-2`}
          disabled={pending}
        />
        <p id="password-help" className="text-muted-foreground mt-1.5 text-xs">
          Usa al menos 8 caracteres.
        </p>
        {state.fieldErrors?.password ? (
          <p id="password-error" className="text-destructive mt-1.5 text-sm">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-foreground text-sm font-medium"
        >
          Confirmar nueva contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
          aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
          aria-describedby={
            state.fieldErrors?.confirmPassword
              ? "confirmPassword-error"
              : undefined
          }
          className={`${inputClassName} mt-2`}
          disabled={pending}
        />
        {state.fieldErrors?.confirmPassword ? (
          <p
            id="confirmPassword-error"
            className="text-destructive mt-1.5 text-sm"
          >
            {state.fieldErrors.confirmPassword}
          </p>
        ) : null}
      </div>

      {state.status === "error" && !state.fieldErrors ? (
        <p
          role="alert"
          className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm"
        >
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full"
        disabled={pending}
      >
        {pending ? "Actualizando…" : "Guardar nueva contraseña"}
      </Button>
    </form>
  );
}
