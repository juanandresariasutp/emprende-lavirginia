"use server";

import { revalidatePath } from "next/cache";

import { parseBusinessForm, type BusinessFormState } from "@/lib/business-form";
import { createClient } from "@/lib/supabase/server";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function updateBusiness(
  businessId: string,
  _previousState: BusinessFormState,
  formData: FormData,
): Promise<BusinessFormState> {
  if (!uuidPattern.test(businessId)) {
    return { status: "error", message: "El negocio solicitado no es válido." };
  }

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
      message: "Tu sesión venció. Ingresa nuevamente para guardar los cambios.",
    };
  }

  const { data: business, error } = await supabase
    .from("businesses")
    .update(input)
    .eq("id", businessId)
    .eq("owner_id", ownerId)
    .select("id, slug")
    .maybeSingle();

  if (error || !business) {
    return {
      status: "error",
      message:
        "No fue posible actualizar el negocio o no tienes permiso para editarlo.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/negocios/${businessId}/editar`);
  revalidatePath(`/negocios/${business.slug}`);

  return {
    status: "success",
    message: "Los cambios se guardaron correctamente.",
  };
}
