import { MapPinned } from "lucide-react";
import type { Metadata } from "next";

import { BusinessMap, type MapBusiness } from "@/components/maps/business-map";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mapa de negocios",
  description: "Explora en el mapa los negocios de La Virginia, Risaralda.",
};

export default async function MapPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("businesses")
    .select("id, name, slug, address, latitude, longitude")
    .eq("status", "approved")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("name", { ascending: true });

  const businesses = (data ?? []).map(
    (business) =>
      ({
        ...business,
        latitude: Number(business.latitude),
        longitude: Number(business.longitude),
      }) satisfies MapBusiness,
  );

  return (
    <div className="page-container py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-primary flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
          <MapPinned aria-hidden="true" className="size-4" />
          Explora La Virginia
        </p>
        <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Negocios en el mapa
        </h1>
        <p className="text-muted-foreground mt-4 leading-7">
          Ubica emprendimientos locales y descubre cuáles están más cerca de ti.
        </p>
      </div>

      <section className="border-border bg-card mt-8 overflow-hidden rounded-2xl border p-1 shadow-sm">
        <BusinessMap businesses={businesses} />
      </section>
    </div>
  );
}
