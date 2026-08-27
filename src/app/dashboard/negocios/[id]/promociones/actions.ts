"use server";

import { revalidatePath } from "next/cache";

import {
  parsePromotionForm,
  type PromotionField,
} from "@/lib/form-validation";
import { createClient } from "@/lib/supabase/server";

export type PromotionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<PromotionField, string>>;
};

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  return { supabase, authenticated: !error && Boolean(data?.claims?.sub) };
}

function revalidatePromotionPages(businessId: string) {
  revalidatePath(`/dashboard/negocios/${businessId}/promociones`);
  revalidatePath("/");
  revalidatePath("/buscar");
}

export async function createPromotion(
  businessId: string,
  _previousState: PromotionState,
  formData: FormData,
): Promise<PromotionState> {
  const { input, fieldErrors } = parsePromotionForm(formData);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors,
    };
  }

  const { supabase, authenticated } = await authenticatedClient();
  if (!authenticated) return { status: "error", message: "Tu sesión venció." };

  const { error } = await supabase
    .from("promotions")
    .insert({ business_id: businessId, ...input });
  if (error)
    return { status: "error", message: "No fue posible crear la promoción." };

  revalidatePromotionPages(businessId);
  return { status: "success", message: "Promoción creada correctamente." };
}

export async function updatePromotion(
  businessId: string,
  promotionId: string,
  _previousState: PromotionState,
  formData: FormData,
): Promise<PromotionState> {
  const { input, fieldErrors } = parsePromotionForm(formData);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors,
    };
  }

  const { supabase, authenticated } = await authenticatedClient();
  if (!authenticated) return { status: "error", message: "Tu sesión venció." };

  const { data, error } = await supabase
    .from("promotions")
    .update(input)
    .eq("id", promotionId)
    .eq("business_id", businessId)
    .select("id")
    .maybeSingle();
  if (error || !data)
    return {
      status: "error",
      message: "No fue posible actualizar la promoción.",
    };

  revalidatePromotionPages(businessId);
  return { status: "success", message: "Promoción actualizada." };
}

export async function deletePromotion(businessId: string, promotionId: string) {
  const { supabase, authenticated } = await authenticatedClient();
  if (!authenticated) return;

  await supabase
    .from("promotions")
    .delete()
    .eq("id", promotionId)
    .eq("business_id", businessId);
  revalidatePromotionPages(businessId);
}
