import { PencilLine } from "lucide-react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CreateBusinessForm } from "@/components/forms/create-business-form";
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

  const { data: business } = await supabase
    .from("businesses")
    .select(
      "id, name, description, phone, whatsapp, instagram, facebook, website, address, latitude, longitude",
    )
    .eq("id", id)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (!business) notFound();

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
    </section>
  );
}
