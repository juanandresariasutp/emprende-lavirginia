import { ArrowRight, MapPin, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type BusinessCardData = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  coverUrl: string | null;
  category: string | null;
  address: string | null;
  isOpen: boolean;
};

type BusinessCardProps = { business: BusinessCardData };

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Link
      href={`/negocios/${business.slug}`}
      aria-label={`Ver perfil de ${business.name}`}
      className="border-border bg-card hover:border-primary/35 hover:shadow-primary/5 focus-visible:ring-ring group flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="from-primary/10 to-accent/35 relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br">
        {business.coverUrl ? (
          <Image
            src={business.coverUrl}
            alt={`Imagen de ${business.name}`}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : business.logoUrl ? (
          <Image
            src={business.logoUrl}
            alt={`Logo de ${business.name}`}
            width={88}
            height={88}
            className="size-20 rounded-2xl border-4 border-white bg-white object-cover shadow-sm"
          />
        ) : (
          <span className="bg-card text-primary flex size-20 items-center justify-center rounded-2xl border shadow-sm">
            <Store aria-hidden="true" className="size-9" />
          </span>
        )}
        {business.coverUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        )}
        <span
          className={`absolute top-4 right-4 rounded-full px-2.5 py-1 text-xs font-semibold ${business.isOpen ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}
        >
          {business.isOpen ? "Abierto" : "Cerrado"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-primary text-xs font-semibold tracking-wide uppercase">
          {business.category ?? "Negocio local"}
        </p>
        <h3 className="text-foreground mt-2 text-lg font-bold text-balance">
          {business.name}
        </h3>
        <p className="text-muted-foreground mt-3 flex items-start gap-2 text-sm leading-5">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {business.address ?? "La Virginia, Risaralda"}
        </p>
        <span className="text-primary mt-5 inline-flex items-center gap-2 text-sm font-semibold">
          Ver perfil
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
