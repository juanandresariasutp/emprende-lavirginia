import {
  BadgePercent,
  CalendarClock,
  Clock3,
  ExternalLink,
  ImageIcon,
  MapPin,
  Package,
  Store,
  Tags,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { BusinessQrCode } from "@/components/business/business-qr-code";
import {
  BusinessProfileView,
  TrackedExternalLink,
  ViewedItem,
} from "@/components/business/public-analytics";
import { WhatsAppButton } from "@/components/business/whatsapp-button";
import {
  ProductCard,
  type ProductCardData,
} from "@/components/catalog/product-card";
import {
  ServiceCard,
  type ServiceCardData,
} from "@/components/catalog/service-card";
import { getSiteUrl } from "@/config/supabase";
import { buttonVariants } from "@/components/ui/button";
import { isBusinessOpenNow } from "@/lib/business-hours";
import { formatLongDate, formatTime12Hour } from "@/lib/formatters";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type BusinessPageProps = {
  params: Promise<{ slug: string }>;
};

const defaultSeoDescription =
  "Conoce este negocio local, sus productos, servicios y promociones en Emprende La Virginia.";

export async function generateMetadata({
  params,
}: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select(
      "name, description, business_images(storage_path, image_type, alt_text)",
    )
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (!business) {
    return {
      title: "Negocio no encontrado",
      robots: { index: false, follow: false },
    };
  }

  const description = business.description
    ? business.description.replace(/\s+/g, " ").trim().slice(0, 160)
    : defaultSeoDescription;
  const shareImage =
    business.business_images.find((image) => image.image_type === "cover") ??
    business.business_images.find((image) => image.image_type === "logo");
  const shareImageUrl = shareImage
    ? supabase.storage
        .from(
          shareImage.image_type === "logo"
            ? "business-logos"
            : "business-images",
        )
        .getPublicUrl(shareImage.storage_path).data.publicUrl
    : null;
  const images = shareImageUrl
    ? [{ url: shareImageUrl, alt: shareImage?.alt_text ?? business.name }]
    : undefined;

  return {
    title: business.name,
    description,
    alternates: { canonical: `/negocios/${slug}` },
    openGraph: {
      type: "website",
      locale: "es_CO",
      siteName: "Emprende La Virginia",
      title: business.name,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: business.name,
      description,
      images: shareImageUrl ? [shareImageUrl] : undefined,
    },
  };
}

const dayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function EmptyContent({ message }: { message: string }) {
  return (
    <p className="border-border text-muted-foreground rounded-2xl border border-dashed p-6 text-sm">
      {message}
    </p>
  );
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select(
      `
      id,
      name,
      slug,
      description,
      address,
      whatsapp,
      instagram,
      latitude,
      longitude,
      business_images(id, storage_path, image_type, alt_text, sort_order),
      business_hours(id, day_of_week, opens_at, closes_at, is_closed),
      business_categories(is_primary, categories(name, slug)),
      products(id, name, description, price, image_url, is_available),
      services(id, name, description, price, is_available),
      promotions(id, title, description, ends_at)
    `,
    )
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (!business) notFound();

  const logo = business.business_images.find(
    (image) => image.image_type === "logo",
  );
  const cover = business.business_images.find(
    (image) => image.image_type === "cover",
  );
  const gallery = business.business_images
    .filter((image) => image.image_type === "gallery")
    .sort((a, b) => a.sort_order - b.sort_order);
  const categories = business.business_categories
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
    .flatMap((relation) => relation.categories);
  const schedules = [...business.business_hours].sort(
    (a, b) => ((a.day_of_week + 6) % 7) - ((b.day_of_week + 6) % 7),
  );
  const isOpen = isBusinessOpenNow(business.business_hours);
  const publicUrl = `${getSiteUrl()}/negocios/${business.slug}`;
  const locationUrl =
    business.latitude !== null && business.longitude !== null
      ? `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`
      : business.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`
        : null;
  const instagramUrl = (() => {
    if (!business.instagram) return null;
    const value = business.instagram.trim();
    if (/^[A-Za-z0-9._]{1,30}$/.test(value.replace(/^@/, ""))) {
      return `https://www.instagram.com/${value.replace(/^@/, "")}/`;
    }
    try {
      const url = new URL(value);
      return ["instagram.com", "www.instagram.com"].includes(url.hostname)
        ? url.toString()
        : null;
    } catch {
      return null;
    }
  })();

  const imageUrl = (
    path: string,
    bucket: "business-logos" | "business-images",
  ) => supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  const productImageUrl = (value: string | null) => {
    if (!value) return null;
    if (!value.startsWith("http")) {
      return supabase.storage.from("products").getPublicUrl(value).data
        .publicUrl;
    }

    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return projectUrl && value.startsWith(`${projectUrl}/storage/`)
      ? value
      : null;
  };

  return (
    <div className="pb-16 sm:pb-20">
      <BusinessProfileView businessId={business.id} />
      <section className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/20 via-accent/30 to-secondary sm:h-72 lg:h-80">
        {cover ? (
          <Image
            src={imageUrl(cover.storage_path, "business-images")}
            alt={cover.alt_text ?? `Portada de ${business.name}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Store aria-hidden="true" className="text-primary/30 size-24" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      </section>

      <div className="page-container">
        <section className="border-border bg-card relative -mt-16 rounded-3xl border p-6 shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="bg-card flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white shadow-md">
              {logo ? (
                <Image
                  src={imageUrl(logo.storage_path, "business-logos")}
                  alt={logo.alt_text ?? `Logo de ${business.name}`}
                  width={96}
                  height={96}
                  className="size-full object-cover"
                />
              ) : (
                <Store aria-hidden="true" className="text-primary size-10" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${isOpen ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}
                >
                  {isOpen ? "Abierto ahora" : "Cerrado ahora"}
                </span>
                {categories.map((category) => (
                  <span
                    key={category.slug}
                    className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
              <h1 className="text-foreground mt-3 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
                {business.name}
              </h1>
              {business.description ? (
                <p className="text-muted-foreground mt-4 max-w-3xl leading-7 whitespace-pre-line">
                  {business.description}
                </p>
              ) : null}
              <p className="text-muted-foreground mt-5 flex items-start gap-2 text-sm">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                {business.address ?? "La Virginia, Risaralda"}
              </p>
              {business.whatsapp ? (
                <WhatsAppButton
                  businessId={business.id}
                  businessName={business.name}
                  phone={business.whatsapp}
                />
              ) : null}
              {locationUrl || instagramUrl ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {locationUrl ? (
                    <TrackedExternalLink
                      href={locationUrl}
                      label={`Ver ubicación de ${business.name}`}
                      event={{
                        businessId: business.id,
                        eventType: "location_click",
                      }}
                      className={cn(buttonVariants({ variant: "outline" }))}
                    >
                      <MapPin aria-hidden="true" /> Ver ubicación
                    </TrackedExternalLink>
                  ) : null}
                  {instagramUrl ? (
                    <TrackedExternalLink
                      href={instagramUrl}
                      label={`Abrir Instagram de ${business.name}`}
                      event={{
                        businessId: business.id,
                        eventType: "instagram_click",
                      }}
                      className={cn(buttonVariants({ variant: "outline" }))}
                    >
                      <ExternalLink aria-hidden="true" /> Instagram
                    </TrackedExternalLink>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-12">
            <section>
              <div className="mb-5 flex items-center gap-3">
                <ImageIcon aria-hidden="true" className="text-primary size-5" />
                <h2 className="text-foreground text-2xl font-bold">Galería</h2>
              </div>
              {gallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {gallery.map((image) => (
                    <div
                      key={image.id}
                      className="bg-muted relative aspect-square overflow-hidden rounded-2xl"
                    >
                      <Image
                        src={imageUrl(image.storage_path, "business-images")}
                        alt={image.alt_text ?? `Imagen de ${business.name}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyContent message="Este negocio todavía no ha publicado imágenes en su galería." />
              )}
            </section>

            <section>
              <div className="mb-5 flex items-center gap-3">
                <Package aria-hidden="true" className="text-primary size-5" />
                <h2 className="text-foreground text-2xl font-bold">
                  Productos
                </h2>
              </div>
              {business.products.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {business.products.map((product) => (
                    <ViewedItem
                      key={product.id}
                      event={{
                        businessId: business.id,
                        eventType: "product_view",
                        productId: product.id,
                      }}
                    >
                      <ProductCard
                        product={
                          {
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            imageUrl: productImageUrl(product.image_url),
                            isAvailable: product.is_available,
                          } satisfies ProductCardData
                        }
                      />
                    </ViewedItem>
                  ))}
                </div>
              ) : (
                <EmptyContent message="Este negocio aún no ha publicado productos." />
              )}
            </section>

            <section>
              <div className="mb-5 flex items-center gap-3">
                <Wrench aria-hidden="true" className="text-primary size-5" />
                <h2 className="text-foreground text-2xl font-bold">
                  Servicios
                </h2>
              </div>
              {business.services.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {business.services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={
                        {
                          id: service.id,
                          name: service.name,
                          description: service.description,
                          price: service.price,
                          isAvailable: service.is_available,
                        } satisfies ServiceCardData
                      }
                    />
                  ))}
                </div>
              ) : (
                <EmptyContent message="Este negocio aún no ha publicado servicios." />
              )}
            </section>

            <section>
              <div className="mb-5 flex items-center gap-3">
                <BadgePercent
                  aria-hidden="true"
                  className="text-primary size-5"
                />
                <h2 className="text-foreground text-2xl font-bold">
                  Promociones
                </h2>
              </div>
              {business.promotions.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {business.promotions.map((promotion) => (
                    <ViewedItem
                      key={promotion.id}
                      event={{
                        businessId: business.id,
                        eventType: "promotion_view",
                        promotionId: promotion.id,
                      }}
                    >
                      <article className="bg-secondary/50 rounded-2xl border p-5">
                        <h3 className="text-secondary-foreground font-semibold">
                          {promotion.title}
                        </h3>
                        {promotion.description ? (
                          <p className="text-muted-foreground mt-2 text-sm leading-6">
                            {promotion.description}
                          </p>
                        ) : null}
                        <p className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
                          <CalendarClock
                            aria-hidden="true"
                            className="size-4"
                          />
                          Hasta el{" "}
                          {formatLongDate(promotion.ends_at)}
                        </p>
                      </article>
                    </ViewedItem>
                  ))}
                </div>
              ) : (
                <EmptyContent message="No hay promociones vigentes en este momento." />
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="bg-card rounded-2xl border p-6">
              <div className="flex items-center gap-3">
                <Clock3 aria-hidden="true" className="text-primary size-5" />
                <h2 className="text-foreground text-lg font-bold">Horarios</h2>
              </div>
              {schedules.length > 0 ? (
                <dl className="mt-5 space-y-3 text-sm">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex justify-between gap-4"
                    >
                      <dt className="text-foreground">
                        {dayNames[schedule.day_of_week]}
                      </dt>
                      <dd className="text-muted-foreground text-right">
                        {schedule.is_closed ||
                        !schedule.opens_at ||
                        !schedule.closes_at
                          ? "Cerrado"
                          : `${formatTime12Hour(schedule.opens_at)} – ${formatTime12Hour(schedule.closes_at)}`}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-muted-foreground mt-4 text-sm leading-6">
                  Horario no disponible.
                </p>
              )}
            </section>

            <section className="bg-card rounded-2xl border p-6">
              <div className="flex items-center gap-3">
                <Tags aria-hidden="true" className="text-primary size-5" />
                <h2 className="text-foreground text-lg font-bold">
                  Categorías
                </h2>
              </div>
              {categories.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span
                      key={category.slug}
                      className="bg-muted rounded-full px-3 py-1.5 text-xs font-medium"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground mt-4 text-sm">
                  Sin categorías registradas.
                </p>
              )}
            </section>

            <BusinessQrCode
              businessName={business.name}
              slug={business.slug}
              url={publicUrl}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
