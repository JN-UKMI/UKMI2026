import type { Metadata } from "next";
import { getAbsoluteUrl, siteConfig } from "./seo";

/**
 * Default Open Graph + Twitter card image dimensions per Next.js / OG spec.
 * 1200x630 is the canonical Open Graph size and is also accepted by Twitter's
 * `summary_large_image` card.
 */
const DEFAULT_OG = {
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — ${siteConfig.shortName}`,
};

interface BuildPageMetadataOptions {
  /** Page-specific title (without site suffix). The template adds ` | JN UKMI`. */
  title: string;
  /** 50–160 char meta description. */
  description: string;
  /** Path on the canonical host, e.g. "/artikel". Leading slash optional. */
  path: string;
  /** Override the OG/Twitter image URL. Defaults to siteConfig.defaultOgImage. */
  image?: string;
  /** Open Graph type. Default "website"; "article" enables article:* fields. */
  type?: "website" | "article";
  /** ISO 8601 publish time (only relevant when type = "article"). */
  publishedTime?: string;
  /** ISO 8601 modified time (optional, for both types). */
  modifiedTime?: string;
  /** Author names, surfaced via article:author / twitter:creator. */
  authors?: string[];
  /** Tags, surfaced via article:tag. */
  tags?: string[];
  /** Override the global locale if needed (rare). */
  locale?: string;
  /** Set `true` to mark noindex for this page (e.g. preview-as-draft). */
  noindex?: boolean;
}

/**
 * Builds a consistent Next.js Metadata object for any page so we don't have
 * to repeat the OG / Twitter / canonical template in every export. The
 * returned object can be spread directly into a per-page `metadata` const
 * or returned from `generateMetadata`.
 *
 * Usage:
 *   export const metadata: Metadata = buildPageMetadata({
 *     title: "Kabinet",
 *     description: "...",
 *     path: "/kabinet",
 *   });
 */
export function buildPageMetadata(
  opts: BuildPageMetadataOptions,
): Metadata {
  const url = getAbsoluteUrl(opts.path);
  const image = opts.image ?? siteConfig.defaultOgImage;
  const isArticle = opts.type === "article";
  const fullTitle = `${opts.title} | ${siteConfig.shortName}`;

  return {
    // Keep the page title unsuffixed here; the root layout's title template
    // appends "| JN UKMI" exactly once.
    title: opts.title,
    description: opts.description,
    authors: opts.authors?.map((name) => ({ name })),
    keywords: opts.tags,
    alternates: { canonical: url },
    openGraph: {
      type: opts.type ?? "website",
      url,
      title: fullTitle,
      description: opts.description,
      siteName: siteConfig.name,
      locale: opts.locale ?? siteConfig.locale,
      images: [
        {
          url: image,
          width: DEFAULT_OG.width,
          height: DEFAULT_OG.height,
          alt: opts.title,
        },
      ],
      ...(isArticle && opts.publishedTime
        ? { publishedTime: opts.publishedTime }
        : {}),
      ...(opts.modifiedTime ? { modifiedTime: opts.modifiedTime } : {}),
      ...(isArticle && opts.authors?.length
        ? { authors: opts.authors }
        : {}),
      ...(isArticle && opts.tags?.length ? { tags: opts.tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      images: [image],
      ...(opts.authors?.length ? { creator: `@${opts.authors[0]}` } : {}),
    },
    robots: opts.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
