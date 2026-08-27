"use client";

import {
  CircleUserRound,
  Home,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  ShieldCheck,
  Store,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/app/dashboard/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeaderViewer = {
  name: string;
  role: "owner" | "admin";
} | null;

const navigation = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/negocios", label: "Negocios", icon: Store },
  { href: "/categorias", label: "Categorías", icon: Tags },
  { href: "/mapa", label: "Mapa", icon: Map },
];

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

function PublicLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return navigation.map((item) => {
    const active = isActivePath(pathname, item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "focus-visible:ring-ring flex items-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          mobile ? "px-3 py-3" : "px-3 py-2",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon
          aria-hidden="true"
          className={cn("size-4", !mobile && "lg:hidden")}
        />
        {item.label}
      </Link>
    );
  });
}

function AccountActions({
  viewer,
  mobile = false,
}: {
  viewer: HeaderViewer;
  mobile?: boolean;
}) {
  const pathname = usePathname();

  if (!viewer) {
    return (
      <>
        <Link
          href="/ingresar"
          aria-current={pathname.startsWith("/ingresar") ? "page" : undefined}
          className={cn(
            buttonVariants({ variant: "ghost", size: "lg" }),
            mobile && "w-full",
          )}
        >
          Ingresar
        </Link>
        <Link
          href="/registro"
          aria-current={pathname.startsWith("/registro") ? "page" : undefined}
          className={cn(buttonVariants({ size: "lg" }), mobile && "w-full")}
        >
          Registrar negocio
        </Link>
      </>
    );
  }

  const isAdmin = viewer.role === "admin";
  const panelHref = isAdmin ? "/admin" : "/dashboard";
  const panelLabel = isAdmin ? "Administración" : "Mi panel";
  const PanelIcon = isAdmin ? ShieldCheck : LayoutDashboard;
  const panelActive = pathname.startsWith(panelHref);

  return (
    <>
      <div className={cn("min-w-0", mobile ? "px-1 pb-1" : "hidden xl:block")}>
        <p className="text-foreground truncate text-sm font-semibold">
          {viewer.name}
        </p>
        <p className="text-muted-foreground text-xs">
          {isAdmin ? "Administrador" : "Propietario"}
        </p>
      </div>
      <Link
        href={panelHref}
        aria-current={panelActive ? "page" : undefined}
        className={cn(
          buttonVariants({
            variant: panelActive ? "secondary" : "default",
            size: "lg",
          }),
          mobile && "w-full",
        )}
      >
        <PanelIcon aria-hidden="true" data-icon="inline-start" />
        {panelLabel}
      </Link>
      <form action={logout} className={cn(mobile && "w-full")}>
        <Button
          type="submit"
          variant="outline"
          size={mobile ? "lg" : "icon-lg"}
          className={cn(mobile && "w-full")}
          aria-label={mobile ? undefined : "Cerrar sesión"}
        >
          <LogOut aria-hidden="true" />
          {mobile && "Cerrar sesión"}
        </Button>
      </form>
    </>
  );
}

export function HeaderNavigation({ viewer }: { viewer: HeaderViewer }) {
  return (
    <>
      <nav
        aria-label="Navegación principal"
        className="hidden items-center md:flex"
      >
        <PublicLinks />
      </nav>

      <div className="hidden items-center gap-2 md:flex">
        <AccountActions viewer={viewer} />
      </div>

      <details className="group relative md:hidden">
        <summary className="border-border bg-card text-foreground hover:bg-muted focus-visible:ring-ring flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
          <span className="sr-only">Abrir menú de navegación</span>
          {viewer ? (
            <CircleUserRound aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </summary>

        <div className="border-border bg-popover text-popover-foreground absolute top-12 right-0 w-[min(21rem,calc(100vw-2rem))] rounded-xl border p-3 shadow-xl">
          <nav aria-label="Navegación móvil" className="flex flex-col">
            <PublicLinks mobile />
          </nav>

          <div className="border-border mt-2 grid gap-2 border-t pt-3">
            <AccountActions viewer={viewer} mobile />
          </div>
        </div>
      </details>
    </>
  );
}
