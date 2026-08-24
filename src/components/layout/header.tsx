import { Menu, Store } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/negocios", label: "Negocios" },
  { href: "/categorias", label: "Categorías" },
  { href: "/promociones", label: "Promociones" },
];

const navigationLinkClass =
  "text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

export function Header() {
  return (
    <header className="border-border/80 bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Emprende La Virginia, ir al inicio"
          className="focus-visible:ring-ring flex shrink-0 items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl shadow-sm">
            <Store aria-hidden="true" className="size-5" strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span className="text-foreground block text-sm font-bold sm:text-base">
              Emprende La Virginia
            </span>
            <span className="text-muted-foreground hidden text-xs sm:block">
              Comercio local más cerca
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navigationLinkClass}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/ingresar"
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
          >
            Ingresar
          </Link>
          <Link href="/registro" className={cn(buttonVariants({ size: "lg" }))}>
            Registrar negocio
          </Link>
        </div>

        <details className="group relative md:hidden">
          <summary className="border-border bg-card text-foreground hover:bg-muted focus-visible:ring-ring flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Abrir menú de navegación</span>
            <Menu aria-hidden="true" className="size-5" />
          </summary>

          <div className="border-border bg-popover text-popover-foreground absolute top-12 right-0 w-[min(20rem,calc(100vw-2rem))] rounded-xl border p-3 shadow-xl">
            <nav aria-label="Navegación móvil" className="flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:bg-muted focus-visible:ring-ring rounded-lg px-3 py-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="border-border mt-2 grid gap-2 border-t pt-3">
              <Link
                href="/ingresar"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full",
                )}
              >
                Ingresar
              </Link>
              <Link
                href="/registro"
                className={cn(buttonVariants({ size: "lg" }), "w-full")}
              >
                Registrar negocio
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
