import { Building2 } from "lucide-react";

import { LogoutButton } from "@/components/forms/logout-button";
import { RoleNavigation } from "@/components/layout/role-navigation";

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

        <RoleNavigation variant="owner" />

        <div className="border-border mt-4 border-t pt-4">
          <LogoutButton />
        </div>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
