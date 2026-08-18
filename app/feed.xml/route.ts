import { getArticles } from "@/lib/sanity";
import { BASE_URL, siteConfig } from "@/lib/seo";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let articles: any[] = [];
  try {
    articles = await getArticles();
  } catch {
    // Sanity tidak tersedia - feed kosong.
  }

  const items = articles
    .slice(0, 20)
    .map((article) => {
      const url = `${BASE_URL}/artikel/${article.slug}`;
      const published = article.publishedAt
        ? new Date(article.publishedAt).toUTCString()
        : new Date().toUTCString();
      return `    <item>
      <title>${escapeXml(article.title || "")}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${published}</pubDate>
      <description>${escapeXml(article.excerpt || "")}</description>
      ${article.author ? `<author>${escapeXml(article.author)}</author>` : ""}
      ${article.category ? `<category>${escapeXml(article.category)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} - Artikel</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>id-id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
    },
  });
}
