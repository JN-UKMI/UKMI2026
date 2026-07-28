#!/usr/bin/env python3
"""
Final SEO-pass closure: fill the three remaining metadata gaps that the
bulk `apply-seo-metadata.py` could not handle (deferred because they
contain nested braces or were absent altogether).

This script:
  1. Adds `export const metadata = buildPageMetadata({...})` to
     `app/tentang/page.tsx` immediately before `export default function`.
     (tentang is `"use client"` — Next.js allows `metadata` exports on
     client route segments; the metadata lives in the route layer, not
     the runtime.)
  2. Replaces `app/artikel/[slug]/page.tsx` generateMetadata with the
     full NewsArticle OG + Twitter + canonical version.
  3. Replaces `app/bidang/[slug]/page.tsx` generateMetadata with a
     buildPageMetadata call.

Idempotent: every replacement is anchored on a unique signature line so
re-running won't double-apply.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


# ── 1. app/tentang/page.tsx ─────────────────────────────────────────────

def patch_tentang(path: Path) -> bool:
    content = path.read_text(encoding="utf-8")
    if "export const metadata = buildPageMetadata" in content:
        print(f"  - {path.name} already has metadata, skipping")
        return False
    # Anchor: insert metadata export immediately before
    # `export default function TentangPage() {`.
    anchor = "export default function TentangPage() {"
    new_meta = (
        "export const metadata = buildPageMetadata({\n"
        "  title: 'Tentang Kami',\n"
        "  description: \"Visi, misi, tujuan, dan sejarah perjalanan dakwah Jamaah Nurul Hada UKMI UNS \\u2014 organisasi kemahasiswaan Islam yang konsisten membina generasi Qur'ani.\",\n"
        "  path: '/tentang',\n"
        "  tags: ['tentang JN UKMI', 'visi misi', 'sejarah', 'nilai luhur'],\n"
        "});\n\n"
    )
    if anchor not in content:
        print(f"  ! {path.name} missing anchor; aborting tentang patch")
        return False
    content = content.replace(anchor, new_meta + anchor, 1)
    path.write_text(content, encoding="utf-8")
    print(f"  ~ {path.name} injected metadata export")
    return True


# ── 2. app/artikel/[slug]/page.tsx generateMetadata ─────────────────────

ARTIKEL_NEWMETA = '''export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let article: any = null;
  try {
    article = await getArticleBySlug(slug);
  } catch {}

  if (!article) {
    article = dummyArticlesDetail.find((a) => a.slug === slug);
  }

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
      robots: { index: false, follow: false },
    };
  }

  const url = `${BASE_URL}/artikel/${article.slug}`;
  const coverImageUrl =
    typeof article.coverImage === "object" && article.coverImage?.asset
      ? urlFor(article.coverImage).url()
      : typeof article.coverImage === "string"
        ? article.coverImage
        : "/placeholder.png";

  const publishedTime =
    article.publishedAt instanceof Date
      ? article.publishedAt.toISOString()
      : typeof article.publishedAt === "string"
        ? article.publishedAt
        : undefined;

  return {
    title: article.title,
    description: article.excerpt,
    authors: article.author ? [{ name: article.author }] : undefined,
    keywords: Array.isArray(article.tags) ? article.tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.excerpt,
      siteName: "Jamaah Nurul Hada UKMI",
      locale: "id_ID",
      images: [{ url: coverImageUrl, width: 1200, height: 630, alt: article.title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(article.author ? { authors: [article.author] } : {}),
      ...(Array.isArray(article.tags) && article.tags.length ? { tags: article.tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [coverImageUrl],
    },
  };
}
'''


def patch_artikel(path: Path) -> bool:
    content = path.read_text(encoding="utf-8")
    # Skip if the new layout is already present.
    if "siteName: \"Jamaah Nurul Hada UKMI\"" in content:
        print(f"  - {path.name} already has enhanced generateMetadata, skipping")
        return False
    # Anchor: the existing generateMetadata function.
    pattern = re.compile(
        r"export async function generateMetadata\(\{ params \}: PageProps\): Promise<Metadata> \{.*?^\}\s*$",
        re.DOTALL | re.MULTILINE,
    )
    if not pattern.search(content):
        print(f"  ! {path.name} didn't match generateMetadata pattern, aborting")
        return False
    content = pattern.sub(ARTIKEL_NEWMETA.rstrip("\n"), content, count=1)
    path.write_text(content, encoding="utf-8")
    print(f"  ~ {path.name} replaced generateMetadata (NewsArticle OG)")
    return True


# ── 3. app/bidang/[slug]/page.tsx generateMetadata ──────────────────────

BIDANG_NEWMETA = '''export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await loadBidang(slug);
    return buildPageMetadata({
      title: data.name,
      description: data.deskripsi || data.description || `Bidang ${data.name} dalam struktur kepengurusan JN UKMI UNS.`,
      path: `/bidang/${slug}`,
      tags: ["bidang UKMI", data.name, "kabinet Iskandar Muda"],
    });
  } catch {
    return buildPageMetadata({
      title: "Bidang Tidak Ditemukan",
      description: "Bidang yang Anda cari tidak ditemukan dalam struktur kepengurusan JN UKMI.",
      path: `/bidang/${slug}`,
      noindex: true,
    });
  }
}
'''


def patch_bidang(path: Path) -> bool:
    content = path.read_text(encoding="utf-8")
    if 'title: data.name' in content and "buildPageMetadata" in content:
        # Already done? verify look for our pattern
        if "noindex: true" in content and "bidang/" in content:
            print(f"  - {path.name} already has enhanced generateMetadata, skipping")
            return False
    pattern = re.compile(
        r"export async function generateMetadata\(\{\s*params,?\s*\}:\s*\{[^}]*\}\): Promise<Metadata> \{.*?^\}\s*$",
        re.DOTALL | re.MULTILINE,
    )
    if not pattern.search(content):
        print(f"  ! {path.name} didn't match generateMetadata pattern, aborting")
        return False
    content = pattern.sub(BIDANG_NEWMETA.rstrip("\n"), content, count=1)
    path.write_text(content, encoding="utf-8")
    print(f"  ~ {path.name} replaced generateMetadata (full OG)")
    return True


def main() -> int:
    edited = sum([
        patch_tentang(ROOT / "app/tentang/page.tsx"),
        patch_artikel(ROOT / "app/artikel/[slug]/page.tsx"),
        patch_bidang(ROOT / "app/bidang/[slug]/page.tsx"),
    ])
    print(f"\nDone: {edited} files updated.")
    return 0 if edited > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
