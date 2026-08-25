"use server";

import { createClient } from "@/lib/supabase/server";

export type UpdatePasswordState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<"password" | "confirmPassword", string>>;
};

export async function updatePassword(
  _previousState: UpdatePasswordState,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const fieldErrors: UpdatePasswordState["fieldErrors"] = {};

  if (password.length < 8 || password.length > 72) {
    fieldErrors.password = "La contraseña debe tener entre 8 y 72 caracteres.";
  }
  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Las contraseñas no coinciden.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error: userError } = await supabase.auth.getUser();

  if (userError) {
    return {
      status: "error",
      message: "El enlace no es válido o ya venció. Solicita uno nuevo.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      status: "error",
      message:
        error.code === "weak_password"
          ? "Usa una contraseña más segura."
          : "No fue posible actualizar la contraseña. Solicita un enlace nuevo.",
    };
  }

  await supabase.auth.signOut({ scope: "local" });

  return {
    status: "success",
    message: "Tu contraseña fue actualizada. Ya puedes ingresar con ella.",
  };
}
