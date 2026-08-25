"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";

import { createClient } from "@/lib/supabase/server";

export type ProductState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<"name" | "description" | "price", string>>;
};

export type ProductImageState = {
  status: "idle" | "error" | "success";
  message: string;
  imageUrl?: string;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const productImageMaxBytes = 5 * 1024 * 1024;

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
  const ownerId = data?.claims?.sub;
  return {
    supabase,
    ownerId,
    authenticated: !error && Boolean(ownerId),
  };
}

async function optimizeProductImage(file: File) {
  const source = Buffer.from(await file.arrayBuffer());
  return sharp(source, { failOn: "warning" })
    .rotate()
    .resize(1200, 1200, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
}

function revalidateProductPages(businessId: string, businessSlug?: string) {
  revalidatePath(`/dashboard/negocios/${businessId}/productos`);
  revalidatePath("/buscar");
  if (businessSlug) revalidatePath(`/negocios/${businessSlug}`);
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

export async function deleteProduct(businessId: string, productId: string) {
  const { supabase, authenticated } = await authenticatedClient();
  if (!authenticated) return;

  const { data: product } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", productId)
    .eq("business_id", businessId)
    .maybeSingle();
  const { data: deletedProduct } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("business_id", businessId)
    .select("id")
    .maybeSingle();
  if (
    deletedProduct &&
    product?.image_url &&
    !/^https?:\/\//i.test(product.image_url)
  ) {
    await supabase.storage.from("products").remove([product.image_url]);
  }
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

export async function uploadProductImage(
  businessId: string,
  productId: string,
  _previousState: ProductImageState,
  formData: FormData,
): Promise<ProductImageState> {
  if (!uuidPattern.test(businessId) || !uuidPattern.test(productId)) {
    return { status: "error", message: "El producto solicitado no es válido." };
  }
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Selecciona una imagen del producto." };
  }
  if (!acceptedImageTypes.has(file.type)) {
    return {
      status: "error",
      message: "La imagen debe ser JPG, PNG o WebP.",
    };
  }
  if (file.size > productImageMaxBytes) {
    return {
      status: "error",
      message: "La imagen no puede pesar más de 5 MB.",
    };
  }

  const { supabase, authenticated, ownerId } = await authenticatedClient();
  if (!authenticated || !ownerId) {
    return { status: "error", message: "Tu sesión venció." };
  }
  const [{ data: business }, { data: product }] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, slug")
      .eq("id", businessId)
      .eq("owner_id", ownerId)
      .maybeSingle(),
    supabase
      .from("products")
      .select("id, image_url")
      .eq("id", productId)
      .eq("business_id", businessId)
      .maybeSingle(),
  ]);
  if (!business || !product) {
    return {
      status: "error",
      message: "No tienes permiso para modificar este producto.",
    };
  }

  let optimized: Buffer;
  try {
    optimized = await optimizeProductImage(file);
  } catch {
    return {
      status: "error",
      message: "El archivo no contiene una imagen válida.",
    };
  }

  const storagePath = `${ownerId}/${businessId}/${productId}/image.webp`;
  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(storagePath, optimized, {
      contentType: "image/webp",
      cacheControl: "3600",
      upsert: true,
    });
  if (uploadError) {
    return {
      status: "error",
      message: "No fue posible subir la imagen del producto.",
    };
  }

  const { data: updatedProduct, error: updateError } = await supabase
    .from("products")
    .update({ image_url: storagePath })
    .eq("id", productId)
    .eq("business_id", businessId)
    .select("id")
    .maybeSingle();
  if (updateError || !updatedProduct) {
    if (!product.image_url) {
      await supabase.storage.from("products").remove([storagePath]);
    }
    return {
      status: "error",
      message: "La imagen se subió, pero no fue posible guardarla.",
    };
  }

  if (
    product.image_url &&
    product.image_url !== storagePath &&
    !/^https?:\/\//i.test(product.image_url)
  ) {
    await supabase.storage.from("products").remove([product.image_url]);
  }

  const publicUrl = supabase.storage.from("products").getPublicUrl(storagePath)
    .data.publicUrl;
  revalidateProductPages(businessId, business.slug);
  return {
    status: "success",
    message: "Imagen del producto actualizada.",
    imageUrl: `${publicUrl}?v=${Date.now()}`,
  };
}

export async function deleteProductImage(
  businessId: string,
  productId: string,
) {
  if (!uuidPattern.test(businessId) || !uuidPattern.test(productId)) return;

  const { supabase, authenticated, ownerId } = await authenticatedClient();
  if (!authenticated || !ownerId) return;
  const [{ data: business }, { data: product }] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, slug")
      .eq("id", businessId)
      .eq("owner_id", ownerId)
      .maybeSingle(),
    supabase
      .from("products")
      .select("id, image_url")
      .eq("id", productId)
      .eq("business_id", businessId)
      .maybeSingle(),
  ]);
  if (!business || !product?.image_url) return;

  if (!/^https?:\/\//i.test(product.image_url)) {
    const { error: storageError } = await supabase.storage
      .from("products")
      .remove([product.image_url]);
    if (storageError) return;
  }
  await supabase
    .from("products")
    .update({ image_url: null })
    .eq("id", productId)
    .eq("business_id", businessId);
  revalidateProductPages(businessId, business.slug);
}
