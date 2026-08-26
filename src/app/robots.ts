import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/config/supabase";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/auth/",
        "/dashboard/",
        "/actualizar-contrasena",
        "/recuperar-contrasena",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
