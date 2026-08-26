import {
  ArrowRight,
  BadgePercent,
  GraduationCap,
  HeartPulse,
  House,
  Clock3,
  MapPin,
  Search,
  Shirt,
  Sparkles,
  Smartphone,
  Store,
  Tags,
  Utensils,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import {
  ActivePromotions,
  type ActivePromotion,
} from "@/components/home/active-promotions";
import { RecentBusinesses } from "@/components/home/recent-businesses";
import type { BusinessCardData } from "@/components/business/business-card";
import { buttonVariants } from "@/components/ui/button";
import { isBusinessOpenNow } from "@/lib/business-hours";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, LucideIcon> = {
  "comida-bebidas": Utensils,
  "belleza-cuidado-personal": Sparkles,
  "servicios-profesionales": Wrench,
  "moda-accesorios": Shirt,
  tecnologia: Smartphone,
  "salud-bienestar": HeartPulse,
  "hogar-decoracion": House,
  "educacion-formacion": GraduationCap,
};

const discoveryOptions = [
  {
    href: "/categorias",
    icon: Tags,
    title: "Explora por categorías",
    description: "Encuentra comida, belleza, moda, tecnología y mucho más.",
  },
  {
    href: "/promociones",
    icon: BadgePercent,
    title: "Aprovecha promociones",
    description: "Descubre oportunidades vigentes en comercios de la zona.",
  },
  {
    href: "/negocios?abierto=ahora",
    icon: Clock3,
    title: "Busca abiertos ahora",
    description: "Ubica negocios disponibles cuando realmente los necesitas.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const [{ data: categories }, { data: promotions }, { data: businesses }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id, name, slug, description")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true })
        .limit(8),
      supabase
        .from("promotions")
        .select("id, title, description, ends_at, businesses(name, slug)")
        .eq("is_active", true)
        .lte("starts_at", now)
        .gt("ends_at", now)
        .order("ends_at", { ascending: true })
        .limit(3),
      supabase
        .from("businesses")
        .select(
          `
          id,
          name,
          slug,
          address,
          business_hours(day_of_week, opens_at, closes_at, is_closed),
          business_images(storage_path, image_type),
          business_categories(is_primary, categories(name))
        `,
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="bg-primary/8 absolute inset-y-0 right-0 -z-10 hidden w-[42%] rounded-l-[5rem] lg:block"
        />
        <div
          aria-hidden="true"
          className="bg-accent/60 absolute -top-24 -left-24 -z-10 size-72 rounded-full blur-3xl"
        />

        <div className="page-container grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
          <div className="max-w-3xl">
            <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
              <MapPin aria-hidden="true" className="size-4" />
              Hecho en La Virginia, Risaralda
            </p>
            <h1 className="text-foreground mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl lg:leading-[1.08]">
              Todo lo local, más fácil de encontrar
            </h1>
            <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7 text-pretty sm:text-lg sm:leading-8">
              Descubre negocios, productos, servicios y promociones de La
              Virginia en un solo lugar. Compra cerca, conecta fácil y apoya a
              quienes hacen crecer el municipio.
            </p>

            <form
              action="/buscar"
              method="get"
              role="search"
              className="border-border bg-card mt-8 flex flex-col gap-2 rounded-2xl border p-2 shadow-lg shadow-black/5 sm:flex-row sm:items-center"
            >
              <label htmlFor="home-search" className="sr-only">
                Buscar productos, servicios o negocios
              </label>
              <div className="relative min-w-0 flex-1">
                <Search
                  aria-hidden="true"
                  className="text-muted-foreground absolute top-1/2 left-3.5 size-5 -translate-y-1/2"
                />
                <input
                  id="home-search"
                  name="q"
                  type="search"
                  minLength={2}
                  maxLength={100}
                  required
                  autoComplete="off"
                  placeholder="¿Qué necesitas hoy?"
                  className="text-foreground placeholder:text-muted-foreground focus:ring-ring/30 h-12 w-full rounded-xl bg-transparent pr-4 pl-11 text-base outline-none focus:ring-3"
                />
              </div>
              <button
                type="submit"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-xl px-5 sm:min-w-28",
                )}
              >
                Buscar
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <Link
                href="/negocios"
                className="text-foreground hover:text-primary focus-visible:ring-ring inline-flex items-center gap-2 rounded-md font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Ver todos los negocios
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <span className="text-muted-foreground flex items-center gap-2">
                <MapPin aria-hidden="true" className="size-4" />
                Comercio cercano y confiable
              </span>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="border-primary/15 bg-card relative overflow-hidden rounded-[2rem] border p-8 shadow-xl shadow-primary/10">
              <div
                aria-hidden="true"
                className="from-primary/15 absolute inset-x-0 top-0 h-28 bg-gradient-to-b to-transparent"
              />
              <div className="relative">
                <span className="bg-primary text-primary-foreground flex size-14 items-center justify-center rounded-2xl shadow-md">
                  <Store aria-hidden="true" className="size-7" />
                </span>
                <p className="text-primary mt-8 text-sm font-semibold uppercase">
                  Una vitrina para todos
                </p>
                <h2 className="text-foreground mt-2 text-2xl font-bold text-balance">
                  Grandes historias comienzan en negocios locales
                </h2>
                <p className="text-muted-foreground mt-4 leading-7">
                  Cada búsqueda puede convertirse en una compra, un contacto o
                  una nueva oportunidad para un emprendedor de La Virginia.
                </p>
                <div className="border-border mt-7 grid grid-cols-2 gap-3 border-t pt-6 text-sm">
                  <div className="bg-muted rounded-xl p-4">
                    <strong className="text-foreground block">
                      Cerca de ti
                    </strong>
                    <span className="text-muted-foreground mt-1 block">
                      Información local
                    </span>
                  </div>
                  <div className="bg-secondary rounded-xl p-4">
                    <strong className="text-secondary-foreground block">
                      Contacto directo
                    </strong>
                    <span className="text-muted-foreground mt-1 block">
                      Sin intermediarios
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {categories && categories.length > 0 ? (
        <section className="page-container py-14 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-primary text-sm font-semibold tracking-wide uppercase">
                Explora lo local
              </p>
              <h2 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Categorías populares
              </h2>
              <p className="text-muted-foreground mt-4 leading-7">
                Encuentra rápidamente los productos y servicios que ofrecen los
                emprendedores de La Virginia.
              </p>
            </div>
            <Link
              href="/categorias"
              className="text-primary inline-flex w-fit items-center gap-2 text-sm font-semibold"
            >
              Ver todas las categorías
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug] ?? Store;

              return (
                <Link
                  key={category.id}
                  href={`/categorias/${category.slug}`}
                  className="border-border bg-card hover:border-primary/35 hover:bg-primary/[0.03] group rounded-2xl border p-5 transition-colors sm:p-6"
                >
                  <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="text-foreground mt-4 font-semibold text-balance">
                    {category.name}
                  </h3>
                  <span className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium">
                    Explorar
                    <ArrowRight
                      aria-hidden="true"
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="bg-muted/35 border-y">
        <div className="page-container py-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              Descubre a tu manera
            </p>
            <h2 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Encuentra una respuesta para cada necesidad
            </h2>
            <p className="text-muted-foreground mt-4 leading-7">
              Empieza por una categoría, revisa las promociones disponibles o
              consulta qué negocios están atendiendo ahora.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {discoveryOptions.map(
              ({ href, icon: Icon, title, description }) => (
                <Link
                  key={href}
                  href={href}
                  className="border-border bg-card hover:border-primary/30 hover:shadow-primary/5 group rounded-2xl border p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="text-foreground mt-5 text-lg font-semibold">
                    {title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    {description}
                  </p>
                  <span className="text-primary mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                    Explorar
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <ActivePromotions promotions={(promotions ?? []) as ActivePromotion[]} />

      <RecentBusinesses
        businesses={(businesses ?? []).map((business) => {
          const logo = business.business_images.find(
            (image) => image.image_type === "logo",
          );
          const primaryCategory = business.business_categories.find(
            (category) => category.is_primary,
          );

          return {
            id: business.id,
            name: business.name,
            slug: business.slug,
            address: business.address,
            logoUrl: logo
              ? supabase.storage
                  .from("business-logos")
                  .getPublicUrl(logo.storage_path).data.publicUrl
              : null,
            category: primaryCategory?.categories[0]?.name ?? null,
            isOpen: isBusinessOpenNow(business.business_hours),
          } satisfies BusinessCardData;
        })}
      />

      <section className="bg-secondary/55 border-y">
        <div className="page-container grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center sm:py-16">
          <div className="max-w-2xl">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              ¿Tienes un negocio?
            </p>
            <h2 className="text-secondary-foreground mt-2 text-3xl font-bold tracking-tight">
              Haz parte de la vitrina comercial de La Virginia
            </h2>
            <p className="text-muted-foreground mt-4 leading-7">
              Crea tu cuenta, registra tu negocio y conecta con personas que ya
              están buscando lo que ofreces.
            </p>
          </div>
          <Link
            href="/registro"
            className={cn(buttonVariants({ size: "lg" }), "h-11 w-fit px-5")}
          >
            Registrar mi negocio
            <ArrowRight aria-hidden="true" data-icon="inline-end" />
          </Link>
        </div>
      </section>
    </>
  );
}
