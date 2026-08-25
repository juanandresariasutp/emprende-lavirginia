"use client";

import { useActionState } from "react";
import Link from "next/link";

import { login, type LoginState } from "@/app/ingresar/actions";
import { Button } from "@/components/ui/button";

const inputClassName =
  "border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring/30 h-11 w-full rounded-lg border px-3 text-sm outline-none transition-shadow focus:ring-3 disabled:cursor-not-allowed disabled:opacity-60";

const initialLoginState: LoginState = {
  status: "idle",
  message: "",
};

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/dashboard" }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(login, initialLoginState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={nextPath} />
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

      <div>
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="password"
            className="text-foreground text-sm font-medium"
          >
            Contraseña
          </label>
          <Link
            href="/recuperar-contrasena"
            className="text-primary text-sm font-medium hover:underline"
          >
            ¿La olvidaste?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(state.fieldErrors?.password)}
          aria-describedby={
            state.fieldErrors?.password ? "password-error" : undefined
          }
          className={`${inputClassName} mt-2`}
          disabled={pending}
        />
        {state.fieldErrors?.password ? (
          <p id="password-error" className="text-destructive mt-1.5 text-sm">
            {state.fieldErrors.password}
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
        {pending ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
