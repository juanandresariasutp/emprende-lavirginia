"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Partial<Record<"email" | "password", string>>;
};

export const initialLoginState: LoginState = {
  status: "idle",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fieldErrors: LoginState["fieldErrors"] = {};

  if (!emailPattern.test(email) || email.length > 254) {
    fieldErrors.email = "Escribe un correo electrónico válido.";
  }
  if (!password) {
    fieldErrors.password = "Escribe tu contraseña.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const messageByCode: Record<string, string> = {
      email_not_confirmed:
        "Debes confirmar tu correo electrónico antes de ingresar.",
      invalid_credentials: "El correo o la contraseña son incorrectos.",
      over_request_rate_limit:
        "Se realizaron demasiados intentos. Espera unos minutos e inténtalo nuevamente.",
    };

    return {
      status: "error",
      message:
        messageByCode[error.code ?? ""] ??
        "No fue posible iniciar sesión. Inténtalo nuevamente.",
    };
  }

  redirect("/dashboard");
}
