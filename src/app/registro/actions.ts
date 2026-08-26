"use server";

import { randomUUID } from "node:crypto";

import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/config/supabase";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

export type RegisterOwnerState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<
    Record<
      | "fullName"
      | "email"
      | "password"
      | "confirmPassword"
      | "terms"
      | "turnstile",
      string
    >
  >;
  turnstileResetKey?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerOwner(
  _previousState: RegisterOwnerState,
  formData: FormData,
): Promise<RegisterOwnerState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const acceptedTerms = formData.get("terms") === "on";
  const fieldErrors: RegisterOwnerState["fieldErrors"] = {};

  if (fullName.length < 2 || fullName.length > 120) {
    fieldErrors.fullName = "Escribe un nombre de entre 2 y 120 caracteres.";
  }
  if (!emailPattern.test(email) || email.length > 254) {
    fieldErrors.email = "Escribe un correo electrónico válido.";
  }
  if (password.length < 8 || password.length > 72) {
    fieldErrors.password = "La contraseña debe tener entre 8 y 72 caracteres.";
  }
  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Las contraseñas no coinciden.";
  }
  if (!acceptedTerms) {
    fieldErrors.terms = "Debes aceptar los términos para continuar.";
  }

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
    email,
    password,
    options: {
      data: { full_name: fullName },
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
