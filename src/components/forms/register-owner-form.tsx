"use client";

import { useActionState } from "react";

import { registerOwner, type RegisterOwnerState } from "@/app/registro/actions";
import { Button } from "@/components/ui/button";

const inputClassName =
  "border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring/30 h-11 w-full rounded-lg border px-3 text-sm outline-none transition-shadow focus:ring-3 disabled:cursor-not-allowed disabled:opacity-60";

const initialRegisterOwnerState: RegisterOwnerState = {
  status: "idle",
  message: "",
};

export function RegisterOwnerForm() {
  const [state, formAction, pending] = useActionState(
    registerOwner,
    initialRegisterOwnerState,
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
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="fullName"
          className="text-foreground text-sm font-medium"
        >
          Nombre completo
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          minLength={2}
          maxLength={120}
          required
          aria-invalid={Boolean(state.fieldErrors?.fullName)}
          aria-describedby={
            state.fieldErrors?.fullName ? "fullName-error" : undefined
          }
          className={`${inputClassName} mt-2`}
          placeholder="Tu nombre y apellido"
          disabled={pending}
        />
        {state.fieldErrors?.fullName ? (
          <p id="fullName-error" className="text-destructive mt-1.5 text-sm">
            {state.fieldErrors.fullName}
          </p>
        ) : null}
      </div>

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
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={
            state.fieldErrors?.email ? "email-error" : undefined
          }
          className={`${inputClassName} mt-2`}
          placeholder="nombre@correo.com"
          disabled={pending}
        />
        {state.fieldErrors?.email ? (
          <p id="email-error" className="text-destructive mt-1.5 text-sm">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="password"
            className="text-foreground text-sm font-medium"
          >
            Contraseña
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
          <p
            id="password-help"
            className="text-muted-foreground mt-1.5 text-xs"
          >
            Mínimo 8 caracteres.
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
            Confirmar contraseña
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
      </div>

      <div>
        <label className="text-muted-foreground flex items-start gap-3 text-sm leading-6">
          <input
            name="terms"
            type="checkbox"
            className="border-input text-primary focus:ring-ring mt-1 size-4 rounded border"
            required
            disabled={pending}
          />
          <span>
            Acepto los términos de uso y la política de privacidad de la
            plataforma.
          </span>
        </label>
        {state.fieldErrors?.terms ? (
          <p className="text-destructive mt-1.5 text-sm">
            {state.fieldErrors.terms}
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
        {pending ? "Creando cuenta…" : "Crear cuenta de propietario"}
      </Button>
    </form>
  );
}
