import { PencilLine } from "lucide-react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CreateBusinessForm } from "@/components/forms/create-business-form";
import {
  BusinessCoverForm,
  BusinessLogoForm,
} from "@/components/forms/business-image-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Editar negocio",
  robots: { index: false, follow: false },
};

type EditBusinessPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBusinessPage({
  params,
}: EditBusinessPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const ownerId = claimsData?.claims?.sub;

  if (!ownerId) redirect(`/ingresar?next=/dashboard/negocios/${id}/editar`);

  const [{ data: business }, { data: images }] = await Promise.all([
    supabase
      .from("businesses")
      .select(
        "id, name, description, phone, whatsapp, instagram, facebook, website, address, latitude, longitude",
      )
      .eq("id", id)
      .eq("owner_id", ownerId)
      .maybeSingle(),
    supabase
      .from("business_images")
      .select("storage_path, image_type, updated_at")
      .eq("business_id", id)
      .in("image_type", ["logo", "cover"]),
  ]);

  if (!business) notFound();

  const logo = images?.find((image) => image.image_type === "logo");
  const cover = images?.find((image) => image.image_type === "cover");

  return (
    <section>
      <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
        <PencilLine aria-hidden="true" className="size-4" />
        Editar negocio
      </p>
      <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight">
        {business.name}
      </h1>
      <p className="text-muted-foreground mt-3 max-w-3xl leading-7">
        Mantén actualizados los datos que verán tus clientes. El estado de
        moderación se administra por separado.
      </p>

      <div className="border-border bg-card mt-7 rounded-2xl border p-5 shadow-sm sm:p-7">
        <CreateBusinessForm
          business={{
            ...business,
            latitude:
              business.latitude === null ? null : Number(business.latitude),
            longitude:
              business.longitude === null ? null : Number(business.longitude),
          }}
        />
      </div>

      <div className="border-border bg-card mt-7 rounded-2xl border p-5 shadow-sm sm:p-7">
        <h2 className="text-foreground text-xl font-bold">Logo</h2>
        <p className="text-muted-foreground mt-2 mb-5 text-sm">
          Usa una imagen cuadrada y legible para identificar tu negocio.
        </p>
        <BusinessLogoForm
          businessId={id}
          currentUrl={
            logo
              ? supabase.storage
                  .from("business-logos")
                  .getPublicUrl(logo.storage_path).data.publicUrl +
                `?v=${new Date(logo.updated_at).getTime()}`
              : undefined
          }
        />
      </div>

      <div className="border-border bg-card mt-7 rounded-2xl border p-5 shadow-sm sm:p-7">
        <h2 className="text-foreground text-xl font-bold">Portada</h2>
        <p className="text-muted-foreground mt-2 mb-5 text-sm">
          Destaca tu negocio con una fotografía horizontal de buena calidad.
        </p>
        <BusinessCoverForm
          businessId={id}
          currentUrl={
            cover
              ? supabase.storage
                  .from("business-images")
                  .getPublicUrl(cover.storage_path).data.publicUrl +
                `?v=${new Date(cover.updated_at).getTime()}`
              : undefined
          }
        />
      </div>
    </section>
  );
}
