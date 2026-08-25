"use client";

import { useActionState } from "react";

import {
  createBusiness,
  type CreateBusinessState,
} from "@/app/dashboard/negocios/nuevo/actions";
import { Button } from "@/components/ui/button";

const inputClassName =
  "border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring/30 mt-2 h-11 w-full rounded-lg border px-3 text-sm outline-none transition-shadow focus:ring-3 disabled:cursor-not-allowed disabled:opacity-60";

const initialState: CreateBusinessState = { status: "idle", message: "" };

type FieldProps = {
  name: keyof NonNullable<CreateBusinessState["fieldErrors"]>;
  label: string;
  type?: "text" | "url" | "number" | "tel";
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  step?: string;
  error?: string;
  disabled: boolean;
};

function Field({ name, label, error, disabled, ...props }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="text-foreground text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClassName}
        disabled={disabled}
        {...props}
      />
      {error ? (
        <p id={`${name}-error`} className="text-destructive mt-1.5 text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CreateBusinessForm() {
  const [state, formAction, pending] = useActionState(
    createBusiness,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <Field
        name="name"
        label="Nombre del negocio"
        placeholder="Ej. Café del Parque"
        maxLength={120}
        required
        error={state.fieldErrors?.name}
        disabled={pending}
      />

      <div>
        <label
          htmlFor="description"
          className="text-foreground text-sm font-medium"
        >
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          maxLength={2000}
          aria-invalid={Boolean(state.fieldErrors?.description)}
          aria-describedby={
            state.fieldErrors?.description ? "description-error" : undefined
          }
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring/30 mt-2 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-3"
          placeholder="Cuenta qué ofrece tu negocio y qué lo hace especial."
          disabled={pending}
        />
        {state.fieldErrors?.description ? (
          <p id="description-error" className="text-destructive mt-1.5 text-sm">
            {state.fieldErrors.description}
          </p>
        ) : null}
      </div>

      <fieldset>
        <legend className="text-foreground font-semibold">Contacto</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field
            name="phone"
            label="Teléfono"
            type="tel"
            maxLength={32}
            error={state.fieldErrors?.phone}
            disabled={pending}
          />
          <Field
            name="whatsapp"
            label="WhatsApp"
            type="tel"
            maxLength={32}
            placeholder="Ej. +57 300 123 4567"
            error={state.fieldErrors?.whatsapp}
            disabled={pending}
          />
          <Field
            name="instagram"
            label="Instagram"
            maxLength={255}
            placeholder="@usuario o enlace"
            error={state.fieldErrors?.instagram}
            disabled={pending}
          />
          <Field
            name="facebook"
            label="Facebook"
            maxLength={255}
            placeholder="Usuario o enlace"
            error={state.fieldErrors?.facebook}
            disabled={pending}
          />
        </div>
        <div className="mt-5">
          <Field
            name="website"
            label="Página web"
            type="url"
            maxLength={2048}
            placeholder="https://ejemplo.com"
            error={state.fieldErrors?.website}
            disabled={pending}
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-foreground font-semibold">Ubicación</legend>
        <div className="mt-4">
          <Field
            name="address"
            label="Dirección"
            maxLength={300}
            placeholder="Calle, carrera, barrio o referencia"
            error={state.fieldErrors?.address}
            disabled={pending}
          />
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field
            name="latitude"
            label="Latitud"
            type="number"
            step="any"
            placeholder="4.89972"
            error={state.fieldErrors?.latitude}
            disabled={pending}
          />
          <Field
            name="longitude"
            label="Longitud"
            type="number"
            step="any"
            placeholder="-75.8825"
            error={state.fieldErrors?.longitude}
            disabled={pending}
          />
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          Las coordenadas son opcionales y permiten mostrar el negocio en el
          mapa.
        </p>
      </fieldset>

      {state.status === "error" && !state.fieldErrors ? (
        <p
          role="alert"
          className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm"
        >
          {state.message}
        </p>
      ) : null}

      <div className="border-border flex justify-end border-t pt-5">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Guardando…" : "Enviar a revisión"}
        </Button>
      </div>
    </form>
  );
}
