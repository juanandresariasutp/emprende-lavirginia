"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
  requestPasswordReset,
  type RequestPasswordResetState,
} from "@/app/recuperar-contrasena/actions";
import { Button } from "@/components/ui/button";

const inputClassName =
  "border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring/30 h-11 w-full rounded-lg border px-3 text-sm outline-none transition-shadow focus:ring-3 disabled:cursor-not-allowed disabled:opacity-60";

const initialRequestPasswordResetState: RequestPasswordResetState = {
  status: "idle",
  message: "",
};

export function RequestPasswordResetForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialRequestPasswordResetState,
  );

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="border-primary/25 bg-primary/5 rounded-xl border p-5"
      >
        <h2 className="text-foreground font-semibold">Revisa tu correo</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          {state.message}
        </p>
        <Link
          href="/ingresar"
          className="text-primary mt-4 inline-block text-sm font-semibold hover:underline"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="text-foreground text-sm font-medium">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          aria-invalid={Boolean(state.emailError)}
          aria-describedby={state.emailError ? "email-error" : undefined}
          className={`${inputClassName} mt-2`}
          placeholder="nombre@correo.com"
          disabled={pending}
        />
        {state.emailError ? (
          <p id="email-error" className="text-destructive mt-1.5 text-sm">
            {state.emailError}
          </p>
        ) : null}
      </div>

      {state.status === "error" && !state.emailError ? (
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
        {pending ? "Enviando…" : "Enviar enlace de recuperación"}
      </Button>
    </form>
  );
}
