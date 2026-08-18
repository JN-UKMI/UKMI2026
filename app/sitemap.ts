import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/seo";
import { getArticles } from "@/lib/sanity";

export const revalidate = 0;

/**
 * Static routes that have semantic priority for SEO crawlers.
 * Dynamic routes (artikel, kegiatan events) are appended at build time
 * - wrapped in try/catch so a Sanity outage doesn't fail the deployment.
 */
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1.0 },
  { path: "/tentang", priority: 0.8 },
  { path: "/kabinet", priority: 0.8 },
  { path: "/ldf", priority: 0.7 },
  { path: "/partner", priority: 0.7 },
  { path: "/artikel", priority: 0.7 },
  { path: "/doa-doa", priority: 0.6 },
  { path: "/al-kahfi", priority: 0.6 },
  { path: "/al-matsurat", priority: 0.6 },
  { path: "/bidang/sekretaris", priority: 0.5 },
  { path: "/bidang/bendahara", priority: 0.5 },
  { path: "/bidang/media", priority: 0.5 },
  { path: "/bidang/syiar", priority: 0.5 },
  { path: "/bidang/internal", priority: 0.5 },
  { path: "/bidang/eksternal", priority: 0.5 },
  { path: "/bidang/kemuslimahan", priority: 0.5 },
  { path: "/kontak", priority: 0.8 },
  { path: "/buku-ukmi", priority: 0.6 },
  { path: "/oki", priority: 0.6 },
  { path: "/ukmi-store", priority: 0.6 },
];

/**
 * Build the sitemap for crawlers.
 *
 * Note: `getArticles()` calls Sanity via the CDN client. If Sanity is
 * down or the token is missing in production builds, we degrade
 * gracefully to the 17 static routes - better an incomplete sitemap
 * than a failed deployment.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: getAbsoluteUrl(r.path),
    changeFrequency: r.path === "/" ? "weekly" : "monthly",
    priority: r.priority,
  }));

  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const articles = await getArticles();
    dynamicEntries = articles
      .filter((a) => typeof a?.slug === "string" && a.slug.length > 0)
      .map((a) => ({
        url: getAbsoluteUrl(`/artikel/${a.slug}`),
        ...(a.publishedAt ? { lastModified: new Date(a.publishedAt) } : {}),
        changeFrequency: "weekly",
        priority: 0.6,
      }));
  } catch (error) {
    // Don't fail the whole sitemap if Sanity is unreachable.
    console.warn(
      "[sitemap] Failed to fetch dynamic articles - serving static routes only.",
      error instanceof Error ? error.message : error,
    );
  }

  return [...staticEntries, ...dynamicEntries];
}
