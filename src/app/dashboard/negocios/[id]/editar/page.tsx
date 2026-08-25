import { PencilLine, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { CreateBusinessForm } from "@/components/forms/create-business-form";
import {
  BusinessCoverForm,
  BusinessGalleryUploadForm,
  BusinessLogoForm,
} from "@/components/forms/business-image-form";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { deleteBusinessGalleryImage } from "../imagenes/actions";

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
      .select("id, storage_path, image_type, alt_text, sort_order, updated_at")
      .eq("business_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  if (!business) notFound();

  const logo = images?.find((image) => image.image_type === "logo");
  const cover = images?.find((image) => image.image_type === "cover");
  const gallery =
    images?.filter((image) => image.image_type === "gallery") ?? [];

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

      <div className="border-border bg-card mt-7 rounded-2xl border p-5 shadow-sm sm:p-7">
        <h2 className="text-foreground text-xl font-bold">Galería</h2>
        <p className="text-muted-foreground mt-2 mb-5 text-sm">
          Muestra instalaciones, trabajos y otros detalles de tu negocio.
        </p>
        {gallery.length > 0 ? (
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((image) => {
              const publicUrl =
                supabase.storage
                  .from("business-images")
                  .getPublicUrl(image.storage_path).data.publicUrl +
                `?v=${new Date(image.updated_at).getTime()}`;
              return (
                <article
                  key={image.id}
                  className="border-border overflow-hidden rounded-xl border"
                >
                  <Image
                    src={publicUrl}
                    alt={image.alt_text ?? "Imagen de la galería"}
                    width={480}
                    height={360}
                    className="aspect-4/3 w-full object-cover"
                    unoptimized
                  />
                  <form
                    action={deleteBusinessGalleryImage.bind(null, id, image.id)}
                    className="flex justify-end p-2"
                  >
                    <button
                      className={cn(
                        buttonVariants({ variant: "destructive", size: "sm" }),
                      )}
                    >
                      <Trash2 aria-hidden="true" className="size-4" /> Eliminar
                    </button>
                  </form>
                </article>
              );
            })}
          </div>
        ) : null}
        <BusinessGalleryUploadForm
          businessId={id}
          currentCount={gallery.length}
        />
      </div>
    </section>
  );
}
