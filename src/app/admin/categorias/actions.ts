"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type CategoryActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

const initialError = (message: string): CategoryActionState => ({
  status: "error",
  message,
});

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(rawSlug || name);
  const description = String(formData.get("description") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const isActive = formData.get("isActive") === "on";

  if (name.length < 2 || name.length > 80) {
    return { error: "El nombre debe tener entre 2 y 80 caracteres." };
  }
  if (slug.length < 2 || slug.length > 80) {
    return { error: "El identificador debe tener entre 2 y 80 caracteres." };
  }
  if (description.length > 500) {
    return { error: "La descripción no puede superar 500 caracteres." };
  }
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 32767) {
    return { error: "El orden debe ser un número entero entre 0 y 32767." };
  }

  return {
    value: {
      name,
      slug,
      description: description || null,
      sort_order: sortOrder,
      is_active: isActive,
    },
  };
}

async function getAdminClient() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (!profile || !["admin", "superadmin"].includes(profile.role)) return null;
  return supabase;
}

function revalidateCategories(slug?: string) {
  revalidatePath("/");
  revalidatePath("/buscar");
  revalidatePath("/admin/categorias");
  if (slug) revalidatePath(`/categorias/${slug}`);
}

export async function createCategory(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  void _previousState;
  const parsed = parseCategory(formData);
  if (!parsed.value) return initialError(parsed.error!);

  const supabase = await getAdminClient();
  if (!supabase)
    return initialError("Tu sesión no tiene permisos de administración.");

  const { error } = await supabase.from("categories").insert(parsed.value);
  if (error) {
    return initialError(
      error.code === "23505"
        ? "Ya existe una categoría con ese nombre o identificador."
        : "No fue posible crear la categoría.",
    );
  }

  revalidateCategories(parsed.value.slug);
  return { status: "success", message: "Categoría creada correctamente." };
}

export async function updateCategory(
  categoryId: string,
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  void _previousState;
  const parsed = parseCategory(formData);
  if (!parsed.value) return initialError(parsed.error!);

  const supabase = await getAdminClient();
  if (!supabase)
    return initialError("Tu sesión no tiene permisos de administración.");

  const { data: current } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", categoryId)
    .maybeSingle();
  if (!current) return initialError("La categoría ya no existe.");

  const { error } = await supabase
    .from("categories")
    .update(parsed.value)
    .eq("id", categoryId);
  if (error) {
    return initialError(
      error.code === "23505"
        ? "Ya existe una categoría con ese nombre o identificador."
        : "No fue posible actualizar la categoría.",
    );
  }

  revalidateCategories(current.slug);
  revalidateCategories(parsed.value.slug);
  return { status: "success", message: "Categoría actualizada." };
}

export async function deleteCategory(
  categoryId: string,
  _previousState: CategoryActionState,
  _formData: FormData,
): Promise<CategoryActionState> {
  void _previousState;
  void _formData;
  const supabase = await getAdminClient();
  if (!supabase)
    return initialError("Tu sesión no tiene permisos de administración.");

  const { data: slug, error } = await supabase.rpc(
    "delete_category_if_unused",
    { p_category_id: categoryId },
  );
  if (error) {
    return initialError(
      error.code === "23503"
        ? "No se puede eliminar porque tiene negocios asociados. Puedes desactivarla."
        : "No fue posible eliminar la categoría.",
    );
  }

  revalidateCategories(slug ?? undefined);
  return { status: "success", message: "Categoría eliminada." };
}
