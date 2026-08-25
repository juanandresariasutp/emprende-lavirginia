"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createBusinessSlug,
  parseBusinessForm,
  type BusinessFormState,
} from "@/lib/business-form";
import { createClient } from "@/lib/supabase/server";

export type CreateBusinessState = BusinessFormState;

export async function createBusiness(
  _previousState: CreateBusinessState,
  formData: FormData,
): Promise<CreateBusinessState> {
  const { input, fieldErrors } = parseBusinessForm(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const ownerId = claimsData?.claims?.sub;

  if (claimsError || !ownerId) {
    return {
      status: "error",
      message: "Tu sesión venció. Ingresa nuevamente para crear el negocio.",
    };
  }

  const baseSlug = createBusinessSlug(input.name) || "negocio";
  let slug = baseSlug;
  let insertError: { code?: string; message: string } | null = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const { error } = await supabase.from("businesses").insert({
      owner_id: ownerId,
      slug,
      ...input,
    });

    insertError = error;
    if (!error) break;
    if (error.code !== "23505" || attempt === 1) break;
    slug = `${baseSlug.slice(0, 92)}-${crypto.randomUUID().slice(0, 7)}`;
  }

  if (insertError) {
    return {
      status: "error",
      message:
        insertError.code === "23505"
          ? "Ya existe un negocio con un nombre muy similar. Ajusta el nombre e inténtalo otra vez."
          : "No fue posible guardar el negocio. Inténtalo nuevamente.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
