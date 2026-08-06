/**
 * SEO utilities — shared resolver for the canonical site URL plus the
 * site-wide configuration that powers our metadata, Open Graph, Twitter
 * cards, and JSON-LD schemas. Imported by robots.ts, sitemap.ts, the
 * root layout, and the page-metadata builder.
 */

/**
 * Resolves the canonical site URL.
 *
 * Priority:
 *   1. Explicit env `NEXT_PUBLIC_BASE_URL`
 *   2. Vercel production URL (`VERCEL_PROJECT_PRODUCTION_URL`)
 *   3. Current Vercel deployment URL (`VERCEL_URL`, https-prefixed)
 *   4. Hardcoded fallback to the production domain
 *
 * Trailing slashes are stripped so callers can safely concatenate paths.
 */
export function resolveBaseUrl(): string {
  let raw = process.env.NEXT_PUBLIC_BASE_URL || "https://jnukmi.com";
  if (raw.includes("jnukmiuns.com")) {
    raw = raw.replace(/jnukmiuns\.com/g, "jnukmi.com");
  }
  return raw.replace(/\/+$/, "");
}

/** Memoized for the duration of the server lifecycle (env vars don't change at runtime). */
export const BASE_URL = resolveBaseUrl();

/** Concatenates a path to the canonical site URL, ensuring exactly one slash. */
export function getAbsoluteUrl(path: string): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${normalised}`;
}

/**
 * Site-wide configuration. Single source of truth for the organisation's
 * brand identity and social presence so per-page metadata stays in sync
 * with the JSON-LD Organization schema.
 */
export const siteConfig = {
  name: "Jamaah Nurul Huda Unit Kegiatan Mahasiswa Islam",
  shortName: "JN UKMI",
  description:
    "Website resmi JN UKMI UNS, organisasi Islam Universitas Sebelas Maret sejak 1991 yang bergerak dalam pembinaan, dakwah kampus, dan pengabdian.",
  url: BASE_URL,
  locale: "id_ID",
  foundingDate: "1991-03-12",
  email: "jnukmi@gmail.com",
  address: {
    name: "Sekretariat OKI JN UKMI UNS",
    locality: "Surakarta",
    region: "Jawa Tengah",
    country: "ID",
  },
  /** Default Open Graph image — overridden by app/opengraph-image.tsx (dynamic). */
  defaultOgImage: "/opengraph-image",
  /** Theme colours (browser chrome + manifest). Forest green is the org's primary. */
  themeColorLight: "#ffffff",
  themeColorDark: "#0a0a0a",
  /**
   * Social handles. Used in JSON-LD `sameAs`, Twitter creator, etc.
   * Typed as Record so Object.values returns a stable `(string | null)[]`
   * and the type-predicate in `socialSameAs()` narrows correctly.
   */
  social: {
    instagram: "https://www.instagram.com/jnukmiuns/",
    youtube: "https://www.youtube.com/@jnukmiuns",
    tiktok: "https://www.tiktok.com/@jnukmiuns",
    spotify: "https://open.spotify.com/show/5PSDOR33zWFxnl2AOu8Rx8",
    telegram: "https://t.me/WejanganGrafisJNUKMI",
    twitter: null,
    facebook: null,
  } as Record<string, string | null>,
  /**
   * Google Search Console verification token. Read from env so prod-only
   * secrets never land in source control.
   */
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFY ?? undefined,
};

/** Returns the array of social URLs for JSON-LD `sameAs`. */
export function socialSameAs(): string[] {
  return Object.values(siteConfig.social).filter(
    (url): url is string => typeof url === "string" && url.length > 0,
  );
}
