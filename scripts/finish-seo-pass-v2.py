#!/usr/bin/env python3
"""
Final SEO closure — fixes the four remaining gaps:

1. `app/artikel/[slug]/page.tsx`:
   - Adds missing `import { BASE_URL, getAbsoluteUrl } from "@/lib/seo";` and
     `import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";`
     (the new generateMetadata references BASE_URL but the import was lost
     during the regex replace).
   - Adds `import { headers } from "next/headers";` for nonce retrieval.
   - Injects two `<script type="application/ld+json" nonce={nonce} …>`
     tags BEFORE the JSX return in the component body:
       * NewsArticle (required for Google rich-results)
       * BreadcrumbList (helps Top Stories eligibility)

2. `app/bidang/[slug]/page.tsx`:
   - Replaces the still-bare generateMetadata with a buildPageMetadata call.
     (Previous regex wasn't greedy enough — fallback here uses a simpler
     anchor: look for any `generateMetadata` function and replace the
     entire function body up to the closing `};`.)

Idempotent — checks for sentinel strings before mutating.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


# ── artikel/[slug]/page.tsx ─────────────────────────────────────────────

ARTIKEL_NEEDED_IMPORTS = """
import { headers } from "next/headers";
import { BASE_URL, getAbsoluteUrl } from "@/lib/seo";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";
"""

# JSX fragment injected just before the `<article>` return
ARTIKEL_NEWS_ARTICLE_LD = (
    'const headersList = await headers();\n'
    'const nonce = headersList.get("x-nonce") ?? undefined;\n'
    'const articleJsonLd = buildArticleJsonLd({\n'
    '  slug: article.slug,\n'
    '  title: article.title,\n'
    '  description: article.excerpt,\n'
    '  image: getCoverImageUrl(),\n'
    '  publishedAt: typeof article.publishedAt === "string" ? article.publishedAt : (article.publishedAt instanceof Date ? article.publishedAt.toISOString() : new Date().toISOString()),\n'
    '  ...(article.author ? { author: article.author } : {}),\n'
    '  ...(article.category ? { category: article.category } : {}),\n'
    '});\n'
    'const breadcrumbJsonLd = buildBreadcrumbJsonLd([\n'
    '  { name: "Beranda", path: "/" },\n'
    '  { name: "Artikel", path: "/artikel" },\n'
    '  { name: article.title, path: `/artikel/${article.slug}` },\n'
    ']);\n'
)

ARTIKEL_NEWS_SCRIPTS = (
    '\n      <script\n'
    '        type="application/ld+json"\n'
    '        nonce={nonce}\n'
    '        suppressHydrationWarning\n'
    '        dangerouslySetInnerHTML={{ __html: articleJsonLd }}\n'
    '      />\n'
    '      <script\n'
    '        type="application/ld+json"\n'
    '        nonce={nonce}\n'
    '        suppressHydrationWarning\n'
    '        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}\n'
    '      />\n'
)


def patch_artikel_imports(content: str) -> str:
    if 'BASE_URL, getAbsoluteUrl }' not in content and 'BASE_URL }' not in content:
        # Insert after the existing `import { headers }` (if present) or after Metadata type.
        anchor = 'import type { Metadata } from "next";\n'
        if anchor not in content:
            return content
        content = content.replace(
            anchor,
            anchor + ARTIKEL_NEEDED_IMPORTS,
            1,
        )
    return content


def patch_artikel_json_ld(content: str) -> str:
    # Inject the helper initialiser + <script> tags BEFORE the `<div className="bg-white …
    # return (` line in the default export.
    if 'articleJsonLd' in content and 'breadcrumbJsonLd' in content:
        return content
    if 'getAbsoluteUrl }' not in content:
        # The script before this one adds the import; bail if it's missing.
        return content
    # Anchor: insert the helper initialiser codesnippet right before `return (      <div className="bg-white`.
    helper_anchor = '  // Safe helper to resolve cover image URL'
    if helper_anchor not in content:
        return content
    content = content.replace(
        helper_anchor, ARTIKEL_NEWS_ARTICLE_LD + '\n' + helper_anchor, 1
    )
    # Insert the <script> tags just before the actual return JSX.
    jsx_anchor = 'return (      <div className="bg-white dark:bg-gray-950">'
    if jsx_anchor not in content:
        # The exact whitespace before <article>. Let me try a softer anchor.
        jsx_anchor = 'return (      <div className="bg-white'
    content = content.replace(jsx_anchor, ARTIKEL_NEWS_SCRIPTS + '\n      ' + jsx_anchor, 1)
    return content


def patch_artikel(path: Path) -> bool:
    content = path.read_text(encoding="utf-8")
    new = patch_artikel_imports(content)
    new = patch_artikel_json_ld(new)
    if new == content:
        print(f"  - {path.name} already finalised, skipping")
        return False
    path.write_text(new, encoding="utf-8")
    print(f"  ~ {path.name} added imports + JSON-LD injection")
    return True


# ── bidang/[slug]/page.tsx ──────────────────────────────────────────────

BIDANG_NEW_FN = """
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await loadBidang(slug);
    return buildPageMetadata({
      title: data.name,
      description:
        data.deskripsi || data.description || `Bidang ${data.name} dalam struktur kepengurusan JN UKMI UNS.`,
      path: `/bidang/${slug}`,
      tags: ["bidang UKMI", data.name, "kabinet Iskandar Muda"],
    });
  } catch {
    return buildPageMetadata({
      title: "Bidang Tidak Ditemukan",
      description:
        "Bidang yang Anda cari tidak ditemukan dalam struktur kepengurusan JN UKMI.",
      path: `/bidang/${slug}`,
      noindex: true,
    });
  }
}
"""


def patch_bidang(path: Path) -> bool:
    content = path.read_text(encoding="utf-8")
    if "noindex: true" in content and "loadBidang(slug)" in content and "buildPageMetadata" in content:
        marker_present = "Bidang Tidak Ditemukan" in content
        if marker_present:
            print(f"  - {path.name} already enhanced, skipping")
            return False
    # Locate the existing generateMetadata declaration up to the closing `}` and replace.
    pattern = re.compile(
        r"export async function generateMetadata[\s\S]+?^\}\s*$",
        re.MULTILINE,
    )
    if not pattern.search(content):
        print(f"  ! {path.name} didn't match any generateMetadata pattern, aborting")
        return False
    content = pattern.sub(BIDANG_NEW_FN.rstrip(), content, count=1)
    path.write_text(content, encoding="utf-8")
    print(f"  ~ {path.name} replaced generateMetadata (buildPageMetadata)")
    return True


def main() -> int:
    edited = sum([
        patch_artikel(ROOT / "app/artikel/[slug]/page.tsx"),
        patch_bidang(ROOT / "app/bidang/[slug]/page.tsx"),
    ])
    print(f"\nDone: {edited} files updated.")
    return 0 if edited > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
