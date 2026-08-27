"use client";

import {
  BarChart3,
  CalendarClock,
  Megaphone,
  Package,
  PencilLine,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function BusinessNavigation({ id, name }: { id: string; name: string }) {
  const pathname = usePathname();
  const basePath = `/dashboard/negocios/${id}`;
  const navigation = [
    { href: `${basePath}/editar`, label: "Datos", icon: PencilLine },
    { href: `${basePath}/horarios`, label: "Horarios", icon: CalendarClock },
    { href: `${basePath}/productos`, label: "Productos", icon: Package },
    { href: `${basePath}/servicios`, label: "Servicios", icon: Wrench },
    { href: `${basePath}/promociones`, label: "Promociones", icon: Megaphone },
    {
      href: `${basePath}/estadisticas`,
      label: "Estadísticas",
      icon: BarChart3,
    },
  ];

  return (
    <div className="border-border bg-card mb-7 rounded-2xl border p-3 shadow-sm">
      <p className="text-muted-foreground px-2 pb-2 text-xs font-semibold tracking-wide uppercase">
        Administrar: <span className="text-foreground">{name}</span>
      </p>
      <nav
        aria-label="Secciones del negocio"
        className="flex gap-1 overflow-x-auto"
      >
        {navigation.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
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
    </div>
  );
}
