"use server";

import { randomUUID } from "node:crypto";

import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/config/supabase";
import {
  parseRegisterOwnerForm,
  type RegisterOwnerField,
} from "@/lib/form-validation";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

export type RegisterOwnerState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<
    Record<
      | RegisterOwnerField
      | "turnstile",
      string
    >
  >;
  turnstileResetKey?: string;
};

export async function registerOwner(
  _previousState: RegisterOwnerState,
  formData: FormData,
): Promise<RegisterOwnerState> {
  const { input, fieldErrors } = parseRegisterOwnerForm(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors,
    };
  }

  const turnstileToken = String(formData.get("turnstileToken") ?? "");
  const verification = await verifyTurnstileToken(turnstileToken, "register");
  if (!verification.success) {
    const configurationError = verification.reason === "configuration";
    return {
      status: "error",
      message: configurationError
        ? "La verificación de seguridad no está configurada."
        : "No fue posible verificar que eres una persona.",
      fieldErrors: {
        turnstile: configurationError
          ? "Contacta al administrador para completar la configuración."
          : "Completa nuevamente la verificación de seguridad.",
      },
      turnstileResetKey: randomUUID(),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { full_name: input.fullName },
      emailRedirectTo: `${getSiteUrl()}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    const messageByCode: Record<string, string> = {
      email_address_invalid: "El correo electrónico no es válido.",
      over_email_send_rate_limit:
        "Se han enviado demasiados correos. Espera unos minutos e inténtalo nuevamente.",
      user_already_exists:
        "No fue posible crear la cuenta. Intenta ingresar o recuperar tu contraseña.",
      weak_password: "Usa una contraseña más segura.",
    };

    return {
      status: "error",
      message:
        messageByCode[error.code ?? ""] ??
        "No fue posible crear la cuenta. Inténtalo nuevamente.",
      turnstileResetKey: randomUUID(),
    };
  }

  return {
    status: "success",
    message:
      "Cuenta creada. Revisa tu correo y confirma tu dirección para poder ingresar.",
  };
}
