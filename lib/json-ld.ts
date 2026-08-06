import { BASE_URL, getAbsoluteUrl, siteConfig, socialSameAs } from "./seo";

/**
 * Schema.org JSON-LD builders.
 *
 * Why string-only (not React Elements) here:
 *   - Callers need to drop the JSON into `<script dangerouslySetInnerHTML>`
 *     where they also attach a per-request nonce + `suppressHydrationWarning`
 *     to keep CSP strict. Centralising the strings keeps every JSON-LD
 *     block identical and easy to validate.
 *
 * Why SocialLink as a separate string list:
 *   - The `<script type="application/ld+json">` for site-wide schemas lives
 *     in `app/layout.tsx` and re-runs the same string builder per request.
 *     Splitting helpers makes tree-shaking easier if a future page ever
 *     wants only one schema.
 */

const ORG_ID = `${BASE_URL}#organization`;
const SITE_ID = `${BASE_URL}#website`;

/** Builds the global Organization + WebSite @graph injected in <head>. */
export function buildSiteJsonLd(): string {
  const graph = [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: siteConfig.name,
      alternateName: siteConfig.shortName,
      url: BASE_URL,
      description: siteConfig.description,
      foundingDate: siteConfig.foundingDate,
      email: siteConfig.email,
      address: {
        "@type": "PostalAddress",
        name: siteConfig.address.name,
        addressLocality: siteConfig.address.locality,
        addressRegion: siteConfig.address.region,
        addressCountry: siteConfig.address.country,
      },
      parentOrganization: {
        "@type": "CollegeOrUniversity",
        name: "Universitas Sebelas Maret",
        alternateName: "UNS",
        url: "https://uns.ac.id",
      },
      logo: {
        "@type": "ImageObject",
        url: getAbsoluteUrl("/favicon_io/android-chrome-512x512.png"),
        width: 512,
        height: 512,
      },
      sameAs: socialSameAs(),
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: BASE_URL,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: { "@id": ORG_ID },
      inLanguage: "id-ID",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/artikel?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ];
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

interface ArticleJsonLdOptions {
  slug: string;
  title: string;
  description: string;
  /** Absolute URL of the cover image. */
  image: string;
  /** ISO 8601 publish date. */
  publishedAt: string;
  /** ISO 8601 modified date, if known. */
  modifiedAt?: string;
  author?: string;
  category?: string;
}

/** Builds a NewsArticle JSON-LD for a single article page. */
export function buildArticleJsonLd(opts: ArticleJsonLdOptions): string {
  const url = getAbsoluteUrl(`/artikel/${opts.slug}`);
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: opts.title,
    description: opts.description,
    image: [opts.image],
    datePublished: opts.publishedAt,
    ...(opts.modifiedAt ? { dateModified: opts.modifiedAt } : {}),
    author: opts.author
      ? { "@type": "Person", name: opts.author }
      : { "@type": "Organization", name: siteConfig.name, "@id": ORG_ID },
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: getAbsoluteUrl("/favicon_io/android-chrome-512x512.png"),
      },
    },
    articleSection: opts.category,
    isPartOf: { "@id": SITE_ID },
    inLanguage: "id-ID",
  });
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

/** Builds a BreadcrumbList JSON-LD for a deep page (e.g. artikel detail). */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  });
}
