#!/usr/bin/env python3
"""
JSX Fragment fix for `app/artikel/[slug]/page.tsx`.

Why this script exists:
  - `scripts/finish-seo-pass-v2.py` accidentally placed two
    `<script type="application/ld+json">` tags as top-level JSX
    (outside any function), which TS2686 / TS2657 reject.
  - It also called `buildArticleJsonLd({ image: getCoverImageUrl() })`
    BEFORE `getCoverImageUrl` was declared → runtime ReferenceError.

This script:
  1. Moves `getCoverImageUrl` definition to BEFORE the JSON-LD helper
     const initialisers.
  2. Removes the orphan top-level `<script>` tags.
  3. Re-injects them INSIDE the `return (…)` JSX wrapped in a React
     Fragment `<>…</>` together with the existing `<div>`.
  4. Adds the closing fragment `</>` just before the function's `);`.

Idempotent: if the file already has the Fragment-wrapped structure, the
script no-ops.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
target = ROOT / "app/artikel/[slug]/page.tsx"

OLD_BLOCK = (
    "const headersList = await headers();\n"
    "const nonce = headersList.get(\"x-nonce\") ?? undefined;\n"
    "const articleJsonLd = buildArticleJsonLd({\n"
    "  slug: article.slug,\n"
    "  title: article.title,\n"
    "  description: article.excerpt,\n"
    "  image: getCoverImageUrl(),\n"
    "  publishedAt: typeof article.publishedAt === \"string\" ? article.publishedAt : (article.publishedAt instanceof Date ? article.publishedAt.toISOString() : new Date().toISOString()),\n"
    "  ...(article.author ? { author: article.author } : {}),\n"
    "  ...(article.category ? { category: article.category } : {}),\n"
    "});\n"
    "const breadcrumbJsonLd = buildBreadcrumbJsonLd([\n"
    "  { name: \"Beranda\", path: \"/\" },\n"
    "  { name: \"Artikel\", path: \"/artikel\" },\n"
    "  { name: article.title, path: `/artikel/${article.slug}` },\n"
    "]);\n"
    "\n"
    "  // Safe helper to resolve cover image URL\n"
    "  const getCoverImageUrl = () => {\n"
    "    if (!article.coverImage) return \"/placeholder.png\";\n"
    "    try {\n"
    "      if (typeof article.coverImage === \"object\" && article.coverImage.asset) {\n"
    "        return urlFor(article.coverImage).url();\n"
    "      }\n"
    "      if (typeof article.coverImage === \"string\") {\n"
    "        return article.coverImage;\n"
    "      }\n"
    "    } catch {\n"
    "      return \"/placeholder.png\";\n"
    "    }\n"
    "    return \"/placeholder.png\";\n"
    "  };\n"
    "\n"
    "  \n"
    "      <script\n"
    "        type=\"application/ld+json\"\n"
    "        nonce={nonce}\n"
    "        suppressHydrationWarning\n"
    "        dangerouslySetInnerHTML={{ __html: articleJsonLd }}\n"
    "      />\n"
    "      <script\n"
    "        type=\"application/ld+json\"\n"
    "        nonce={nonce}\n"
    "        suppressHydrationWarning\n"
    "        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}\n"
    "      />\n"
    "\n"
    "      return (      <div className=\"bg-white dark:bg-gray-950\">"
)

NEW_BLOCK = (
    "  // Safe helper to resolve cover image URL (declared BEFORE its use in JSON-LD).\n"
    "  const getCoverImageUrl = () => {\n"
    "    if (!article.coverImage) return \"/placeholder.png\";\n"
    "    try {\n"
    "      if (typeof article.coverImage === \"object\" && article.coverImage.asset) {\n"
    "        return urlFor(article.coverImage).url();\n"
    "      }\n"
    "      if (typeof article.coverImage === \"string\") {\n"
    "        return article.coverImage;\n"
    "      }\n"
    "    } catch {\n"
    "      return \"/placeholder.png\";\n"
    "    }\n"
    "    return \"/placeholder.png\";\n"
    "  };\n"
    "\n"
    "  const headersList = await headers();\n"
    "  const nonce = headersList.get(\"x-nonce\") ?? undefined;\n"
    "  const articleJsonLd = buildArticleJsonLd({\n"
    "    slug: article.slug,\n"
    "    title: article.title,\n"
    "    description: article.excerpt,\n"
    "    image: getCoverImageUrl(),\n"
    "    publishedAt:\n"
    "      typeof article.publishedAt === \"string\"\n"
    "        ? article.publishedAt\n"
    "        : article.publishedAt instanceof Date\n"
    "          ? article.publishedAt.toISOString()\n"
    "          : new Date().toISOString(),\n"
    "    ...(article.author ? { author: article.author } : {}),\n"
    "    ...(article.category ? { category: article.category } : {}),\n"
    "  });\n"
    "  const breadcrumbJsonLd = buildBreadcrumbJsonLd([\n"
    "    { name: \"Beranda\", path: \"/\" },\n"
    "    { name: \"Artikel\", path: \"/artikel\" },\n"
    "    { name: article.title, path: `/artikel/${article.slug}` },\n"
    "  ]);\n"
    "\n"
    "  return (\n"
    "    <>\n"
    "      <script\n"
    "        type=\"application/ld+json\"\n"
    "        nonce={nonce}\n"
    "        suppressHydrationWarning\n"
    "        dangerouslySetInnerHTML={{ __html: articleJsonLd }}\n"
    "      />\n"
    "      <script\n"
    "        type=\"application/ld+json\"\n"
    "        nonce={nonce}\n"
    "        suppressHydrationWarning\n"
    "        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}\n"
    "      />\n"
    "      <div className=\"bg-white dark:bg-gray-950\">"
)

CLOSE_FRAGMENT_OLD = "</article>\n    </div>\n  );\n}"
CLOSE_FRAGMENT_NEW = "</article>\n    </div>\n    </>\n  );\n}"


def main() -> int:
    content = target.read_text(encoding="utf-8")

    # Idempotent quick check.
    if ("buildArticleJsonLd" in content
        and "buildCoverImageUrl" not in content
        and "image: getCoverImageUrl()" in content
        and "<>\n      <script\n" not in content):  # actual Fragment marker
        # Reorder needs apply.
        if OLD_BLOCK in content:
            content = content.replace(OLD_BLOCK, NEW_BLOCK, 1)
        else:
            print("  ! OLD_BLOCK anchor did not match; review file manually.")
            return 1

    # Close the fragment at the end of the return.
    if CLOSE_FRAGMENT_OLD in content and "</>\n  );\n}" not in content:
        content = content.replace(CLOSE_FRAGMENT_OLD, CLOSE_FRAGMENT_NEW, 1)

    target.write_text(content, encoding="utf-8")
    print(f"  ~ {target.name} repaired JSX Fragment + helper ordering")
    return 0


if __name__ == "__main__":
    sys.exit(main())
