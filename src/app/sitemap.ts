import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";

import { getSiteUrl, getSupabaseConfig } from "@/config/supabase";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const { url, publishableKey } = getSupabaseConfig();
  const supabase = createClient(url, publishableKey, {
    auth: { persistSession: false },
  });

  const [businessesResult, categoriesResult] = await Promise.all([
    supabase
      .from("businesses")
      .select("slug, updated_at")
      .eq("status", "approved")
      .order("slug", { ascending: true }),
    supabase
      .from("categories")
      .select("slug, updated_at")
      .eq("is_active", true)
      .order("slug", { ascending: true }),
  ]);

  if (businessesResult.error) {
    console.error("No fue posible incluir los negocios en el sitemap.");
  }
  if (categoriesResult.error) {
    console.error("No fue posible incluir las categorías en el sitemap.");
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/buscar`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/negocios`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/categorias`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/promociones`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/mapa`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/registro`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const businessRoutes: MetadataRoute.Sitemap = (
    businessesResult.data ?? []
  ).map((business) => ({
    url: `${siteUrl}/negocios/${business.slug}`,
    lastModified: business.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  const categoryRoutes: MetadataRoute.Sitemap = (
    categoriesResult.data ?? []
  ).map((category) => ({
    url: `${siteUrl}/categorias/${category.slug}`,
    lastModified: category.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...businessRoutes, ...categoryRoutes];
}
