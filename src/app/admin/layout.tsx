import { Building2, LayoutDashboard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/forms/logout-button";
import { createClient } from "@/lib/supabase/server";

const adminNavigation = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/negocios", label: "Negocios pendientes", icon: Building2 },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) redirect("/ingresar?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", userId)
    .maybeSingle();
  if (!profile || !["admin", "superadmin"].includes(profile.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="page-container grid flex-1 gap-6 py-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:py-10">
      <aside className="border-border bg-card h-fit rounded-2xl border p-4 shadow-sm lg:sticky lg:top-24">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-foreground truncate text-sm font-bold">
              {profile.full_name || "Administración"}
            </p>
            <p className="text-muted-foreground text-xs">
              Panel administrativo
            </p>
          </div>
        </div>

        <nav aria-label="Navegación administrativa" className="mt-4 grid gap-1">
          {adminNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <Icon aria-hidden="true" className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-border mt-4 border-t pt-4">
          <LogoutButton />
        </div>
      </aside>

      <main className="min-w-0">{children}</main>
    </div>
  );
}
