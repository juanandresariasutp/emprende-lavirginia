import { notFound, redirect } from "next/navigation";

import { BusinessNavigation } from "@/components/layout/business-navigation";
import { createClient } from "@/lib/supabase/server";

type BusinessLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function BusinessLayout({
  children,
  params,
}: BusinessLayoutProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const ownerId = claimsData?.claims?.sub;

  if (!ownerId) redirect(`/ingresar?next=/dashboard/negocios/${id}/editar`);

  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("id", id)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (!business) notFound();

  return (
    <div>
      <BusinessNavigation id={id} name={business.name} />
      {children}
    </div>
  );
}
