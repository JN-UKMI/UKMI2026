import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

/**
 * Robots.txt for search-engine crawlers.
 *
 * - Allow public pages
 * - Disallow protected / internal / preview routes so search engines
 *   don't index admin panels, API endpoints, or the auth flow.
 * - Reference the sitemap so crawlers can discover every published URL.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/login/",
          "/loading/",
          "/403/",
          "/artikel/tulis",
          "/artikel/*/edit",
          "/admin/artikel/*/edit",
          "/*?*preview=*",
          "/*?*draft=*",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
