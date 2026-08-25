import {
  CalendarClock,
  Megaphone,
  Package,
  PencilLine,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

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

  const navigation = [
    {
      href: `/dashboard/negocios/${id}/editar`,
      label: "Datos",
      icon: PencilLine,
    },
    {
      href: `/dashboard/negocios/${id}/horarios`,
      label: "Horarios",
      icon: CalendarClock,
    },
    {
      href: `/dashboard/negocios/${id}/productos`,
      label: "Productos",
      icon: Package,
    },
    {
      href: `/dashboard/negocios/${id}/servicios`,
      label: "Servicios",
      icon: Wrench,
    },
    {
      href: `/dashboard/negocios/${id}/promociones`,
      label: "Promociones",
      icon: Megaphone,
    },
  ];

  return (
    <div>
      <div className="border-border bg-card mb-7 rounded-2xl border p-3 shadow-sm">
        <p className="text-muted-foreground px-2 pb-2 text-xs font-semibold tracking-wide uppercase">
          Administrar: <span className="text-foreground">{business.name}</span>
        </p>
        <nav
          aria-label="Secciones del negocio"
          className="flex gap-1 overflow-x-auto"
        >
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:bg-muted hover:text-foreground flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                <Icon aria-hidden="true" className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}
    </div>
  );
}
