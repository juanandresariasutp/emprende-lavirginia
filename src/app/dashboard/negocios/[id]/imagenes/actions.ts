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
const coverMaxBytes = 5 * 1024 * 1024;
const galleryMaxBytes = 5 * 1024 * 1024;
const galleryLimit = 6;
const galleryUploadLimit = 3;

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

async function optimizeCover(file: File) {
  const source = Buffer.from(await file.arrayBuffer());
  return sharp(source, { failOn: "warning" })
    .rotate()
    .resize(1600, 900, {
      fit: "cover",
      position: "attention",
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
}

async function optimizeGalleryImage(file: File) {
  const source = Buffer.from(await file.arrayBuffer());
  return sharp(source, { failOn: "warning" })
    .rotate()
    .resize(1600, 1200, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80, effort: 4 })
    .toBuffer();
}

function galleryFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);
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

  const publicUrl = supabase.storage
    .from("business-logos")
    .getPublicUrl(storagePath).data.publicUrl;
  revalidatePath("/");
  revalidatePath("/buscar");
  revalidatePath(`/dashboard/negocios/${businessId}/editar`);
  revalidatePath(`/negocios/${business.slug}`);
  return {
    status: "success",
    message: "Logo actualizado.",
    imageUrl: `${publicUrl}?v=${Date.now()}`,
  };
}

export async function uploadBusinessCover(
  businessId: string,
  _previousState: BusinessImageState,
  formData: FormData,
): Promise<BusinessImageState> {
  if (!uuidPattern.test(businessId)) {
    return { status: "error", message: "El negocio solicitado no es válido." };
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Selecciona una imagen de portada." };
  }
  if (!acceptedTypes.has(file.type)) {
    return {
      status: "error",
      message: "La portada debe ser una imagen JPG, PNG o WebP.",
    };
  }
  if (file.size > coverMaxBytes) {
    return {
      status: "error",
      message: "La portada no puede pesar más de 5 MB.",
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const ownerId = claimsData?.claims?.sub;
  if (claimsError || !ownerId) {
    return { status: "error", message: "Tu sesión venció." };
  }

  const [{ data: business }, { data: previousCover }] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, name, slug")
      .eq("id", businessId)
      .eq("owner_id", ownerId)
      .maybeSingle(),
    supabase
      .from("business_images")
      .select("id, storage_path")
      .eq("business_id", businessId)
      .eq("image_type", "cover")
      .maybeSingle(),
  ]);
  if (!business) {
    return {
      status: "error",
      message: "No tienes permiso para modificar este negocio.",
    };
  }

  let optimized: Buffer;
  try {
    optimized = await optimizeCover(file);
  } catch {
    return {
      status: "error",
      message: "El archivo no contiene una imagen válida.",
    };
  }

  const storagePath = `${ownerId}/${businessId}/cover.webp`;
  const { error: uploadError } = await supabase.storage
    .from("business-images")
    .upload(storagePath, optimized, {
      contentType: "image/webp",
      cacheControl: "3600",
      upsert: true,
    });
  if (uploadError) {
    return { status: "error", message: "No fue posible subir la portada." };
  }

  const reference = {
    business_id: businessId,
    storage_path: storagePath,
    image_type: "cover",
    alt_text: "Portada del negocio",
  };
  const { error: referenceError } = previousCover
    ? await supabase
        .from("business_images")
        .update(reference)
        .eq("id", previousCover.id)
        .eq("business_id", businessId)
    : await supabase.from("business_images").insert(reference);
  if (referenceError) {
    if (!previousCover) {
      await supabase.storage.from("business-images").remove([storagePath]);
    }
    return {
      status: "error",
      message: "La portada se subió, pero no se pudo guardar su referencia.",
    };
  }

  if (previousCover && previousCover.storage_path !== storagePath) {
    await supabase.storage
      .from("business-images")
      .remove([previousCover.storage_path]);
  }

  const publicUrl = supabase.storage
    .from("business-images")
    .getPublicUrl(storagePath).data.publicUrl;
  revalidatePath("/");
  revalidatePath("/buscar");
  revalidatePath(`/dashboard/negocios/${businessId}/editar`);
  revalidatePath(`/negocios/${business.slug}`);
  return {
    status: "success",
    message: "Portada actualizada.",
    imageUrl: `${publicUrl}?v=${Date.now()}`,
  };
}

export async function uploadBusinessGallery(
  businessId: string,
  _previousState: BusinessImageState,
  formData: FormData,
): Promise<BusinessImageState> {
  if (!uuidPattern.test(businessId)) {
    return { status: "error", message: "El negocio solicitado no es válido." };
  }

  const files = galleryFiles(formData);
  if (files.length === 0) {
    return { status: "error", message: "Selecciona al menos una imagen." };
  }
  if (files.length > galleryUploadLimit) {
    return {
      status: "error",
      message: `Puedes subir máximo ${galleryUploadLimit} imágenes por envío.`,
    };
  }
  if (files.some((file) => !acceptedTypes.has(file.type))) {
    return {
      status: "error",
      message: "Todas las imágenes deben ser JPG, PNG o WebP.",
    };
  }
  if (files.some((file) => file.size > galleryMaxBytes)) {
    return {
      status: "error",
      message: "Cada imagen puede pesar máximo 5 MB.",
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const ownerId = claimsData?.claims?.sub;
  if (claimsError || !ownerId) {
    return { status: "error", message: "Tu sesión venció." };
  }

  const [{ data: business }, { count }] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, name, slug")
      .eq("id", businessId)
      .eq("owner_id", ownerId)
      .maybeSingle(),
    supabase
      .from("business_images")
      .select("id", { count: "exact", head: true })
      .eq("business_id", businessId)
      .eq("image_type", "gallery"),
  ]);
  if (!business) {
    return {
      status: "error",
      message: "No tienes permiso para modificar este negocio.",
    };
  }
  const currentCount = count ?? 0;
  if (currentCount + files.length > galleryLimit) {
    return {
      status: "error",
      message: `La galería admite máximo ${galleryLimit} imágenes. Te quedan ${Math.max(0, galleryLimit - currentCount)} espacios.`,
    };
  }

  let optimizedImages: Buffer[];
  try {
    optimizedImages = await Promise.all(files.map(optimizeGalleryImage));
  } catch {
    return {
      status: "error",
      message: "Uno de los archivos no contiene una imagen válida.",
    };
  }

  const objects = optimizedImages.map((contents) => ({
    contents,
    path: `${ownerId}/${businessId}/gallery/${crypto.randomUUID()}.webp`,
  }));
  const uploadedPaths: string[] = [];
  for (const object of objects) {
    const { error } = await supabase.storage
      .from("business-images")
      .upload(object.path, object.contents, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from("business-images").remove(uploadedPaths);
      }
      return {
        status: "error",
        message: "No fue posible completar la carga de la galería.",
      };
    }
    uploadedPaths.push(object.path);
  }

  const { error: referenceError } = await supabase
    .from("business_images")
    .insert(
      uploadedPaths.map((storagePath, index) => ({
        business_id: businessId,
        storage_path: storagePath,
        image_type: "gallery",
        alt_text: `Imagen ${currentCount + index + 1} de ${business.name ?? "la galería"}`,
        sort_order: currentCount + index,
      })),
    );
  if (referenceError) {
    await supabase.storage.from("business-images").remove(uploadedPaths);
    return {
      status: "error",
      message: "No fue posible guardar las imágenes de la galería.",
    };
  }

  revalidatePath(`/dashboard/negocios/${businessId}/editar`);
  revalidatePath(`/negocios/${business.slug}`);
  return {
    status: "success",
    message: `${files.length} ${files.length === 1 ? "imagen agregada" : "imágenes agregadas"}.`,
  };
}

export async function deleteBusinessGalleryImage(
  businessId: string,
  imageId: string,
) {
  if (!uuidPattern.test(businessId) || !uuidPattern.test(imageId)) return;

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const ownerId = claimsData?.claims?.sub;
  if (claimsError || !ownerId) return;

  const [{ data: business }, { data: image }] = await Promise.all([
    supabase
      .from("businesses")
      .select("id, slug")
      .eq("id", businessId)
      .eq("owner_id", ownerId)
      .maybeSingle(),
    supabase
      .from("business_images")
      .select("id, storage_path")
      .eq("id", imageId)
      .eq("business_id", businessId)
      .eq("image_type", "gallery")
      .maybeSingle(),
  ]);
  if (!business || !image) return;

  const { error: storageError } = await supabase.storage
    .from("business-images")
    .remove([image.storage_path]);
  if (storageError) return;

  await supabase
    .from("business_images")
    .delete()
    .eq("id", image.id)
    .eq("business_id", businessId)
    .eq("image_type", "gallery");
  revalidatePath(`/dashboard/negocios/${businessId}/editar`);
  revalidatePath(`/negocios/${business.slug}`);
}
