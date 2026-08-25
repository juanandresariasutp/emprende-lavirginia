import { Trash2, Wrench } from "lucide-react";
import type { Metadata } from "next";

import { deleteService } from "./actions";
import {
  ServiceForm,
  type EditableService,
} from "@/components/forms/service-form";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Servicios",
  robots: { index: false },
};
type ServicesPageProps = { params: Promise<{ id: string }> };

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("id, name, description, price, is_available")
    .eq("business_id", id)
    .order("created_at", { ascending: false });
  const services = (data ?? []).map((service) => ({
    ...service,
    price: service.price === null ? null : Number(service.price),
  })) satisfies EditableService[];

  return (
    <section>
      <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
        <Wrench aria-hidden="true" className="size-4" /> Oferta profesional
      </p>
      <h1 className="text-foreground mt-2 text-3xl font-bold">Servicios</h1>
      <p className="text-muted-foreground mt-3">
        Publica y mantén actualizados los servicios de tu negocio.
      </p>
      <div className="border-border bg-card mt-7 rounded-2xl border p-5 shadow-sm">
        <h2 className="text-foreground mb-4 font-bold">Nuevo servicio</h2>
        <ServiceForm businessId={id} />
      </div>
      <div className="mt-7 grid gap-4">
        {services.map((service) => (
          <article
            key={service.id}
            className="border-border bg-card rounded-2xl border p-5 shadow-sm"
          >
            <ServiceForm businessId={id} service={service} />
            <div className="border-border mt-4 flex justify-end border-t pt-4">
              <form action={deleteService.bind(null, id, service.id)}>
                <button
                  className={cn(
                    buttonVariants({ variant: "destructive", size: "sm" }),
                  )}
                >
                  <Trash2 aria-hidden="true" className="size-4" /> Eliminar
                </button>
              </form>
            </div>
          </article>
        ))}
        {services.length === 0 ? (
          <p className="border-border text-muted-foreground rounded-2xl border border-dashed p-8 text-center text-sm">
            Aún no has creado servicios.
          </p>
        ) : null}
      </div>
    </section>
  );
}
