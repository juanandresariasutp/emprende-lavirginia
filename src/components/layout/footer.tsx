import { MapPin, Store } from "lucide-react";
import Link from "next/link";

const platformLinks = [
  { href: "/negocios", label: "Explorar negocios" },
  { href: "/categorias", label: "Ver categorías" },
];

const businessLinks = [
  { href: "/registro", label: "Registrar negocio" },
  { href: "/ingresar", label: "Ingresar" },
];

const legalLinks = [
  { href: "/terminos", label: "Términos de uso" },
  { href: "/privacidad", label: "Política de privacidad" },
];

const footerLinkClass =
  "text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border bg-card border-t">
      <div className="page-container py-10 sm:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="Emprende La Virginia, ir al inicio"
              className="focus-visible:ring-ring inline-flex items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span className="from-primary to-brand-orange text-primary-foreground flex size-9 items-center justify-center rounded-xl bg-gradient-to-br">
                <Store aria-hidden="true" className="size-5" />
              </span>
              <span className="text-foreground font-bold">
                Emprende La Virginia
              </span>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm leading-6">
              Un punto de encuentro digital para descubrir y apoyar el comercio
              local.
            </p>
            <p className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
              <MapPin aria-hidden="true" className="text-primary size-4" />
              La Virginia, Risaralda, Colombia
            </p>
          </div>

          <div>
            <h2 className="text-foreground text-sm font-semibold">Explorar</h2>
            <nav aria-label="Enlaces de la plataforma" className="mt-4">
              <ul className="space-y-3">
                {platformLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={footerLinkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="text-foreground text-sm font-semibold">
              Para negocios
            </h2>
            <nav aria-label="Enlaces para negocios" className="mt-4">
              <ul className="space-y-3">
                {businessLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={footerLinkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="border-border mt-10 flex flex-col gap-4 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            © {currentYear} Emprende La Virginia. Todos los derechos reservados.
          </p>
          <nav aria-label="Enlaces legales">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
