import { CircleCheck, Wrench } from "lucide-react";

import { formatCurrencyCop } from "@/lib/formatters";

export type ServiceCardData = {
  id: string;
  name: string;
  description: string | null;
  price: number | string | null;
  isAvailable: boolean;
};

type ServiceCardProps = {
  service: ServiceCardData;
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="border-border bg-card flex h-full flex-col rounded-2xl border p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
          <Wrench aria-hidden="true" className="size-5" />
        </span>
        {service.isAvailable ? (
          <span className="text-primary flex items-center gap-1.5 text-xs font-semibold">
            <CircleCheck aria-hidden="true" className="size-4" />
            Disponible
          </span>
        ) : null}
      </div>

      <h3 className="text-foreground mt-5 text-lg font-semibold text-balance">
        {service.name}
      </h3>
      {service.description ? (
        <p className="text-muted-foreground mt-2 line-clamp-4 text-sm leading-6">
          {service.description}
        </p>
      ) : (
        <p className="text-muted-foreground mt-2 text-sm">
          Contacta al negocio para conocer más detalles.
        </p>
      )}
      <p className="text-primary mt-auto pt-5 text-lg font-bold">
        {service.price === null
          ? "Consultar precio"
          : formatCurrencyCop(service.price)}
      </p>
    </article>
  );
}
