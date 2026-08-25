"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ServiceState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<"name" | "description" | "price", string>>;
};

function parseService(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const descriptionValue = String(formData.get("description") ?? "").trim();
  const description = descriptionValue || null;
  const priceText = String(formData.get("price") ?? "").trim();
  const price = priceText ? Number(priceText) : null;
  const isAvailable = formData.get("isAvailable") === "on";
  const fieldErrors: ServiceState["fieldErrors"] = {};

  if (name.length < 2 || name.length > 120) {
    fieldErrors.name = "Escribe un nombre de entre 2 y 120 caracteres.";
  }
  if (description && description.length > 2000) {
    fieldErrors.description =
      "La descripción no puede superar 2000 caracteres.";
  }
  if (
    price !== null &&
    (!Number.isFinite(price) || price < 0 || price > 9_999_999_999.99)
  ) {
    fieldErrors.price = "Escribe un precio válido o deja el campo vacío.";
  }

  return {
    input: { name, description, price, is_available: isAvailable },
    fieldErrors,
  };
}

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  return { supabase, authenticated: !error && Boolean(data?.claims?.sub) };
}

export async function createService(
  businessId: string,
  _previousState: ServiceState,
  formData: FormData,
): Promise<ServiceState> {
  const { input, fieldErrors } = parseService(formData);
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
    .from("services")
    .insert({ business_id: businessId, ...input });
  if (error)
    return { status: "error", message: "No fue posible crear el servicio." };
  revalidatePath(`/dashboard/negocios/${businessId}/servicios`);
  return { status: "success", message: "Servicio creado correctamente." };
}

export async function updateService(
  businessId: string,
  serviceId: string,
  _previousState: ServiceState,
  formData: FormData,
): Promise<ServiceState> {
  const { input, fieldErrors } = parseService(formData);
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
    .from("services")
    .update(input)
    .eq("id", serviceId)
    .eq("business_id", businessId)
    .select("id")
    .maybeSingle();
  if (error || !data)
    return {
      status: "error",
      message: "No fue posible actualizar el servicio.",
    };
  revalidatePath(`/dashboard/negocios/${businessId}/servicios`);
  revalidatePath("/buscar");
  return { status: "success", message: "Servicio actualizado." };
}

export async function deleteService(businessId: string, serviceId: string) {
  const { supabase, authenticated } = await authenticatedClient();
  if (!authenticated) return;
  await supabase
    .from("services")
    .delete()
    .eq("id", serviceId)
    .eq("business_id", businessId);
  revalidatePath(`/dashboard/negocios/${businessId}/servicios`);
  revalidatePath("/buscar");
}
