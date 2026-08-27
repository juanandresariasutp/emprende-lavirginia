"use client";

import { Building2, LayoutDashboard, PlusCircle, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navigation = {
  owner: [
    {
      href: "/dashboard",
      label: "Resumen",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/dashboard/negocios/nuevo",
      label: "Crear negocio",
      icon: PlusCircle,
      exact: false,
    },
  ],
  admin: [
    { href: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
    {
      href: "/admin/negocios",
      label: "Negocios pendientes",
      icon: Building2,
      exact: false,
    },
    {
      href: "/admin/categorias",
      label: "Categorías",
      icon: Tags,
      exact: false,
    },
  ],
};

export function RoleNavigation({ variant }: { variant: "owner" | "admin" }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={
        variant === "admin"
          ? "Navegación administrativa"
          : "Navegación del panel"
      }
      className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0"
    >
      {navigation[variant].map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-visible:ring-ring flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon aria-hidden="true" className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
