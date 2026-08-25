"use server";

import { getSiteUrl } from "@/config/supabase";
import { createClient } from "@/lib/supabase/server";

export type RequestPasswordResetState = {
  status: "idle" | "error" | "success";
  message: string;
  emailError?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function requestPasswordReset(
  _previousState: RequestPasswordResetState,
  formData: FormData,
): Promise<RequestPasswordResetState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!emailPattern.test(email) || email.length > 254) {
    return {
      status: "error",
      message: "Revisa el correo ingresado.",
      emailError: "Escribe un correo electrónico válido.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/confirm?next=/actualizar-contrasena`,
  });

  if (error) {
    return {
      status: "error",
      message:
        error.code === "over_email_send_rate_limit"
          ? "Se han solicitado demasiados correos. Espera unos minutos e inténtalo nuevamente."
          : "No fue posible enviar el correo. Inténtalo nuevamente.",
    };
  }

  return {
    status: "success",
    message:
      "Si existe una cuenta asociada, recibirás un enlace para cambiar la contraseña.",
  };
}
