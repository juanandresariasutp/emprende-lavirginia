"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ProductState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<"name" | "description" | "price", string>>;
};

function parseProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const descriptionValue = String(formData.get("description") ?? "").trim();
  const description = descriptionValue || null;
  const priceText = String(formData.get("price") ?? "").trim();
  const price = Number(priceText);
  const isAvailable = formData.get("isAvailable") === "on";
  const fieldErrors: ProductState["fieldErrors"] = {};

  if (name.length < 2 || name.length > 120) {
    fieldErrors.name = "Escribe un nombre de entre 2 y 120 caracteres.";
  }
  if (description && description.length > 2000) {
    fieldErrors.description =
      "La descripción no puede superar 2000 caracteres.";
  }
  if (
    !priceText ||
    !Number.isFinite(price) ||
    price < 0 ||
    price > 9_999_999_999.99
  ) {
    fieldErrors.price = "Escribe un precio válido igual o mayor que cero.";
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

export async function createProduct(
  businessId: string,
  _previousState: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const { input, fieldErrors } = parseProduct(formData);
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
    .from("products")
    .insert({ business_id: businessId, ...input });
  if (error)
    return { status: "error", message: "No fue posible crear el producto." };

  revalidatePath(`/dashboard/negocios/${businessId}/productos`);
  return { status: "success", message: "Producto creado correctamente." };
}

export async function updateProduct(
  businessId: string,
  productId: string,
  _previousState: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const { input, fieldErrors } = parseProduct(formData);
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
    .from("products")
    .update(input)
    .eq("id", productId)
    .eq("business_id", businessId)
    .select("id")
    .maybeSingle();

  if (error || !data)
    return {
      status: "error",
      message: "No fue posible actualizar el producto.",
    };

  revalidatePath(`/dashboard/negocios/${businessId}/productos`);
  revalidatePath("/buscar");
  return { status: "success", message: "Producto actualizado." };
}

export async function deleteProduct(
  businessId: string,
  productId: string,
) {
  const { supabase, authenticated } = await authenticatedClient();
  if (!authenticated) return;

  await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("business_id", businessId);
  revalidatePath(`/dashboard/negocios/${businessId}/productos`);
  revalidatePath("/buscar");
}

export async function toggleProductAvailability(
  businessId: string,
  productId: string,
  nextAvailability: boolean,
) {
  const { supabase, authenticated } = await authenticatedClient();
  if (!authenticated) return;

  await supabase
    .from("products")
    .update({ is_available: nextAvailability })
    .eq("id", productId)
    .eq("business_id", businessId);
  revalidatePath(`/dashboard/negocios/${businessId}/productos`);
  revalidatePath("/buscar");
}
