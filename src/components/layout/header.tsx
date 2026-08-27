import { Store } from "lucide-react";
import Link from "next/link";

import {
  HeaderNavigation,
  type HeaderViewer,
} from "@/components/layout/header-navigation";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  let viewer: HeaderViewer = null;

  try {
    const supabase = await createClient();
    const { data: claimsData } = await supabase.auth.getClaims();
    const userId = claimsData?.claims?.sub;

    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", userId)
        .maybeSingle();

      viewer = {
        name: profile?.full_name || "Mi cuenta",
        role:
          profile?.role === "admin" || profile?.role === "superadmin"
            ? "admin"
            : "owner",
      };
    }
  } catch {
    // La navegación pública sigue disponible si la sesión no puede resolverse.
  }

  return (
    <header className="border-border/80 bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="page-container flex min-h-16 items-center justify-between gap-4 py-2">
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
        <HeaderNavigation viewer={viewer} />
      </div>
    </header>
  );
}
