"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ApprovalState = {
  status: "idle" | "error" | "success";
  message: string;
};

export type RejectionState = ApprovalState & {
  fieldError?: string;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function approveBusiness(
  businessId: string,
  _previousState: ApprovalState,
  _formData: FormData,
): Promise<ApprovalState> {
  void _previousState;
  void _formData;

  if (!uuidPattern.test(businessId)) {
    return { status: "error", message: "El negocio solicitado no es válido." };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) {
    return { status: "error", message: "Tu sesión venció." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (!profile || !["admin", "superadmin"].includes(profile.role)) {
    return {
      status: "error",
      message: "No tienes permisos para aprobar negocios.",
    };
  }

  const { data: slug, error } = await supabase.rpc("approve_business", {
    p_business_id: businessId,
  });
  if (error || !slug) {
    return {
      status: "error",
      message: "No fue posible aprobar el negocio.",
    };
  }

  revalidatePath("/");
  revalidatePath("/buscar");
  revalidatePath("/admin");
  revalidatePath("/admin/negocios");
  revalidatePath(`/admin/negocios/${businessId}`);
  revalidatePath(`/negocios/${slug}`);
  return { status: "success", message: "Negocio aprobado correctamente." };
}

export async function rejectBusiness(
  businessId: string,
  _previousState: RejectionState,
  formData: FormData,
): Promise<RejectionState> {
  void _previousState;
  if (!uuidPattern.test(businessId)) {
    return { status: "error", message: "El negocio solicitado no es válido." };
  }
  const reason = String(formData.get("reason") ?? "").trim();
  if (reason.length < 2 || reason.length > 1000) {
    return {
      status: "error",
      message: "Revisa el motivo del rechazo.",
      fieldError: "Escribe un motivo de entre 2 y 1000 caracteres.",
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) {
    return { status: "error", message: "Tu sesión venció." };
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (!profile || !["admin", "superadmin"].includes(profile.role)) {
    return { status: "error", message: "No tienes permisos para rechazar." };
  }

  const { data: slug, error } = await supabase.rpc("reject_business", {
    p_business_id: businessId,
    p_reason: reason,
  });
  if (error || !slug) {
    return { status: "error", message: "No fue posible rechazar el negocio." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/negocios");
  revalidatePath(`/admin/negocios/${businessId}`);
  revalidatePath(`/negocios/${slug}`);
  return { status: "success", message: "Negocio rechazado." };
}
