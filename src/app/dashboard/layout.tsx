import { Building2, LayoutDashboard, PlusCircle } from "lucide-react";
import Link from "next/link";

import { LogoutButton } from "@/components/forms/logout-button";

const dashboardNavigation = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  {
    href: "/dashboard/negocios/nuevo",
    label: "Crear negocio",
    icon: PlusCircle,
  },
];

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <div className="page-container grid flex-1 gap-6 py-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:py-10">
      <aside className="border-border bg-card h-fit rounded-2xl border p-4 shadow-sm lg:sticky lg:top-24">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
            <Building2 aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-foreground text-sm font-bold">Mi negocio</p>
            <p className="text-muted-foreground text-xs">
              Panel de propietario
            </p>
          </div>
        </div>

        <nav
          aria-label="Navegación del panel"
          className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0"
        >
          {dashboardNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
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

      <div className="min-w-0">{children}</div>
    </div>
  );
}
