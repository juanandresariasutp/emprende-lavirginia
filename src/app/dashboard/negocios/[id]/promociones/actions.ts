"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type PromotionField =
  "title" | "description" | "imageUrl" | "startsAt" | "endsAt";

export type PromotionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<PromotionField, string>>;
};

const localDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function colombiaDateToIso(value: string) {
  if (!localDatePattern.test(value)) return null;
  const date = new Date(`${value}:00-05:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parsePromotion(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const descriptionValue = String(formData.get("description") ?? "").trim();
  const description = descriptionValue || null;
  const imageUrlValue = String(formData.get("imageUrl") ?? "").trim();
  const imageUrl = imageUrlValue || null;
  const startsAtText = String(formData.get("startsAt") ?? "");
  const endsAtText = String(formData.get("endsAt") ?? "");
  const startsAt = colombiaDateToIso(startsAtText);
  const endsAt = colombiaDateToIso(endsAtText);
  const isActive = formData.get("isActive") === "on";
  const fieldErrors: PromotionState["fieldErrors"] = {};

  if (title.length < 2 || title.length > 140) {
    fieldErrors.title = "Escribe un título de entre 2 y 140 caracteres.";
  }
  if (description && description.length > 2000) {
    fieldErrors.description =
      "La descripción no puede superar 2000 caracteres.";
  }
  if (imageUrl && (imageUrl.length > 2048 || !URL.canParse(imageUrl))) {
    fieldErrors.imageUrl = "Escribe una URL válida de máximo 2048 caracteres.";
  }
  if (!startsAt)
    fieldErrors.startsAt = "Selecciona una fecha de inicio válida.";
  if (!endsAt)
    fieldErrors.endsAt = "Selecciona una fecha de finalización válida.";
  if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) {
    fieldErrors.endsAt = "La finalización debe ser posterior al inicio.";
  }

  return {
    input: {
      title,
      description,
      image_url: imageUrl,
      starts_at: startsAt,
      ends_at: endsAt,
      is_active: isActive,
    },
    fieldErrors,
  };
}

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
  const { input, fieldErrors } = parsePromotion(formData);
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
  const { input, fieldErrors } = parsePromotion(formData);
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
