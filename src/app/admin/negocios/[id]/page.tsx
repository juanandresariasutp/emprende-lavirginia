import {
  ArrowLeft,
  Building2,
  ExternalLink,
  MapPin,
  Package,
  Phone,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ApproveBusinessButton } from "@/components/forms/approve-business-button";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Revisar negocio",
  robots: { index: false, follow: false },
};

type BusinessReviewPageProps = { params: Promise<{ id: string }> };

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
  suspended: "Suspendido",
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  suspended: "bg-slate-200 text-slate-700",
};

export default async function BusinessReviewPage({
  params,
}: BusinessReviewPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select(
      "id, owner_id, name, slug, description, phone, whatsapp, instagram, facebook, website, address, latitude, longitude, status, is_verified, is_featured, created_at, business_categories(categories(id, name)), business_images(id, storage_path, image_type, alt_text, sort_order), products(id, name, description, price, is_available), services(id, name, description, price, is_available)",
    )
    .eq("id", id)
    .maybeSingle();
  if (!business) notFound();

  const [{ data: owner }, { data: moderationActions }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", business.owner_id)
      .maybeSingle(),
    supabase
      .from("business_moderation_actions")
      .select("id, action, previous_status, new_status, created_at")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);
  const logo = business.business_images.find(
    (image) => image.image_type === "logo",
  );
  const cover = business.business_images.find(
    (image) => image.image_type === "cover",
  );
  const gallery = business.business_images
    .filter((image) => image.image_type === "gallery")
    .sort((a, b) => a.sort_order - b.sort_order);
  const publicImageUrl = (path: string, bucket: string) =>
    supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;

  return (
    <section>
      <Link
        href="/admin/negocios"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Volver a pendientes
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
            <Building2 aria-hidden="true" className="size-4" /> Revisión de
            negocio
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-bold">
            {business.name}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Propietario: {owner?.full_name || "Sin nombre registrado"}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[business.status] ?? statusStyles.pending}`}
        >
          {statusLabels[business.status] ?? business.status}
        </span>
      </div>

      {cover ? (
        <div className="border-border relative mt-7 aspect-[16/7] overflow-hidden rounded-2xl border">
          <Image
            src={publicImageUrl(cover.storage_path, "business-images")}
            alt={cover.alt_text || `Portada de ${business.name}`}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
            unoptimized
          />
        </div>
      ) : null}

      <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-5">
          <article className="border-border bg-card rounded-2xl border p-6 shadow-sm">
            <div className="flex items-start gap-4">
              {logo ? (
                <Image
                  src={publicImageUrl(logo.storage_path, "business-logos")}
                  alt={logo.alt_text || `Logo de ${business.name}`}
                  width={88}
                  height={88}
                  className="size-22 rounded-xl object-contain"
                  unoptimized
                />
              ) : null}
              <div>
                <h2 className="text-foreground text-xl font-bold">
                  Información
                </h2>
                <p className="text-muted-foreground mt-3 whitespace-pre-line leading-7">
                  {business.description || "Sin descripción."}
                </p>
              </div>
            </div>
            <dl className="border-border mt-5 grid gap-3 border-t pt-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Categorías</dt>
                <dd className="text-foreground mt-1 font-medium">
                  {business.business_categories
                    .flatMap((assignment) =>
                      assignment.categories.map((category) => category.name),
                    )
                    .filter(Boolean)
                    .join(", ") || "Sin categorías"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Registrado</dt>
                <dd className="text-foreground mt-1 font-medium">
                  {new Intl.DateTimeFormat("es-CO", {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(new Date(business.created_at))}
                </dd>
              </div>
            </dl>
          </article>

          {gallery.length > 0 ? (
            <article className="border-border bg-card rounded-2xl border p-6 shadow-sm">
              <h2 className="text-foreground text-xl font-bold">Galería</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((image) => (
                  <Image
                    key={image.id}
                    src={publicImageUrl(image.storage_path, "business-images")}
                    alt={image.alt_text || "Imagen de la galería"}
                    width={480}
                    height={360}
                    className="aspect-4/3 w-full rounded-xl object-cover"
                    unoptimized
                  />
                ))}
              </div>
            </article>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <article className="border-border bg-card rounded-2xl border p-6 shadow-sm">
              <h2 className="text-foreground flex items-center gap-2 text-lg font-bold">
                <Package aria-hidden="true" className="text-primary size-5" />
                Productos ({business.products.length})
              </h2>
              <ul className="mt-4 grid gap-3">
                {business.products.map((product) => (
                  <li
                    key={product.id}
                    className="border-border border-b pb-3 text-sm"
                  >
                    <span className="text-foreground font-semibold">
                      {product.name}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      ${Number(product.price).toLocaleString("es-CO")}
                    </span>
                  </li>
                ))}
                {business.products.length === 0 ? (
                  <li className="text-muted-foreground text-sm">
                    Sin productos.
                  </li>
                ) : null}
              </ul>
            </article>
            <article className="border-border bg-card rounded-2xl border p-6 shadow-sm">
              <h2 className="text-foreground flex items-center gap-2 text-lg font-bold">
                <Wrench aria-hidden="true" className="text-primary size-5" />
                Servicios ({business.services.length})
              </h2>
              <ul className="mt-4 grid gap-3">
                {business.services.map((service) => (
                  <li
                    key={service.id}
                    className="border-border border-b pb-3 text-sm"
                  >
                    <span className="text-foreground font-semibold">
                      {service.name}
                    </span>
                    {service.price !== null ? (
                      <span className="text-muted-foreground ml-2">
                        Desde ${Number(service.price).toLocaleString("es-CO")}
                      </span>
                    ) : null}
                  </li>
                ))}
                {business.services.length === 0 ? (
                  <li className="text-muted-foreground text-sm">
                    Sin servicios.
                  </li>
                ) : null}
              </ul>
            </article>
          </div>
        </div>

        <aside className="border-border bg-card h-fit rounded-2xl border p-6 shadow-sm xl:sticky xl:top-24">
          {business.status === "pending" ? (
            <div className="border-border mb-6 border-b pb-6">
              <h2 className="text-foreground text-lg font-bold">
                Decisión de moderación
              </h2>
              <p className="text-muted-foreground mt-2 mb-4 text-sm">
                Al aprobar, el negocio aparecerá inmediatamente en el directorio
                público.
              </p>
              <ApproveBusinessButton businessId={business.id} />
            </div>
          ) : null}
          <h2 className="text-foreground text-lg font-bold">
            Contacto y ubicación
          </h2>
          <dl className="mt-4 grid gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground flex items-center gap-2">
                <Phone aria-hidden="true" className="size-4" /> Teléfono
              </dt>
              <dd className="text-foreground mt-1 font-medium">
                {business.phone || "No registrado"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground flex items-center gap-2">
                <MapPin aria-hidden="true" className="size-4" /> Dirección
              </dt>
              <dd className="text-foreground mt-1 font-medium">
                {business.address || "No registrada"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">WhatsApp</dt>
              <dd className="text-foreground mt-1 font-medium">
                {business.whatsapp || "No registrado"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Redes</dt>
              <dd className="text-foreground mt-1 break-words">
                {[business.instagram, business.facebook]
                  .filter(Boolean)
                  .join(" · ") || "No registradas"}
              </dd>
            </div>
          </dl>
          {business.website ? (
            <a
              href={business.website}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-5 w-full",
              )}
            >
              <ExternalLink aria-hidden="true" className="size-4" /> Sitio web
            </a>
          ) : null}

          {(moderationActions ?? []).length > 0 ? (
            <div className="border-border mt-6 border-t pt-6">
              <h2 className="text-foreground text-lg font-bold">Historial</h2>
              <ol className="mt-3 grid gap-3">
                {(moderationActions ?? []).map((action) => (
                  <li key={action.id} className="text-sm">
                    <p className="text-foreground font-medium">
                      {action.action === "approve"
                        ? "Negocio aprobado"
                        : `${action.previous_status} → ${action.new_status}`}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {new Intl.DateTimeFormat("es-CO", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(action.created_at))}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
