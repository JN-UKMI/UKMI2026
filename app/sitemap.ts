import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://jnukmi.com";

const routes: { path: string; priority?: number }[] = [
  { path: "/", priority: 1.0 },
  { path: "/tentang", priority: 0.8 },
  { path: "/kabinet", priority: 0.8 },
  { path: "/ldf", priority: 0.7 },
  { path: "/artikel", priority: 0.7 },
  { path: "/doa-doa", priority: 0.6 },
  { path: "/al-kahfi", priority: 0.6 },
  { path: "/al-masurat", priority: 0.6 },
  { path: "/bidang/sekretaris", priority: 0.5 },
  { path: "/bidang/bendahara", priority: 0.5 },
  { path: "/bidang/media", priority: 0.5 },
  { path: "/bidang/syiar", priority: 0.5 },
  { path: "/bidang/internal", priority: 0.5 },
  { path: "/bidang/eksternal", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.path === "/" ? "weekly" : "monthly",
    priority: route.priority ?? 0.5,
  }));
}
