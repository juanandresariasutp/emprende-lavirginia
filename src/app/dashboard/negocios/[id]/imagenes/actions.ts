"use server";

import { revalidatePath } from "next/cache";
import sharp from "sharp";

import { createClient } from "@/lib/supabase/server";

export type BusinessImageState = {
  status: "idle" | "error" | "success";
  message: string;
  imageUrl?: string;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const logoMaxBytes = 2 * 1024 * 1024;

async function optimizeLogo(file: File) {
  const source = Buffer.from(await file.arrayBuffer());
  return sharp(source, { failOn: "warning" })
    .rotate()
    .resize(512, 512, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
}

export async function uploadBusinessLogo(
  businessId: string,
  _previousState: BusinessImageState,
  formData: FormData,
): Promise<BusinessImageState> {
  if (!uuidPattern.test(businessId)) {
    return { status: "error", message: "El negocio solicitado no es válido." };
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Selecciona una imagen para el logo." };
  }
  if (!acceptedTypes.has(file.type)) {
    return {
      status: "error",
      message: "El logo debe ser una imagen JPG, PNG o WebP.",
    };
  }
  if (file.size > logoMaxBytes) {
    return {
      status: "error",
      message: "El logo no puede pesar más de 2 MB.",
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const ownerId = claimsData?.claims?.sub;
  if (claimsError || !ownerId) {
    return { status: "error", message: "Tu sesión venció." };
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id, slug")
    .eq("id", businessId)
    .eq("owner_id", ownerId)
    .maybeSingle();
  if (!business) {
    return {
      status: "error",
      message: "No tienes permiso para modificar este negocio.",
    };
  }

  let optimized: Buffer;
  try {
    optimized = await optimizeLogo(file);
  } catch {
    return {
      status: "error",
      message: "El archivo no contiene una imagen válida.",
    };
  }

  const storagePath = `${ownerId}/${businessId}/logo.webp`;
  const { error: uploadError } = await supabase.storage
    .from("business-logos")
    .upload(storagePath, optimized, {
      contentType: "image/webp",
      cacheControl: "3600",
      upsert: true,
    });
  if (uploadError) {
    return { status: "error", message: "No fue posible subir el logo." };
  }

  const { error: referenceError } = await supabase
    .from("business_images")
    .upsert(
      {
        business_id: businessId,
        storage_path: storagePath,
        image_type: "logo",
        alt_text: "Logo del negocio",
      },
      { onConflict: "business_id,storage_path" },
    );
  if (referenceError) {
    return {
      status: "error",
      message: "El logo se subió, pero no fue posible guardar su referencia.",
    };
  }

  const imageUrl = supabase.storage
    .from("business-logos")
    .getPublicUrl(storagePath).data.publicUrl;
  revalidatePath("/");
  revalidatePath("/buscar");
  revalidatePath(`/dashboard/negocios/${businessId}/editar`);
  revalidatePath(`/negocios/${business.slug}`);
  return { status: "success", message: "Logo actualizado.", imageUrl };
}
