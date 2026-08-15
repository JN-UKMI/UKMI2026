import type { Metadata } from "next";

import { headers } from "next/headers";
import { BASE_URL, getAbsoluteUrl, siteConfig } from "@/lib/seo";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";
import {
  getArticles,
  getArticleBySlug,
  getArticlesByCategory,
  urlFor,
  type ArticlesListResult,
} from "@/lib/sanity";
import { createClient } from "next-sanity";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ShareButton } from "@/components/article/ShareButton";
import { ArticleReadingBar } from "@/components/article/ArticleReadingBar";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ArticleHeroCard } from "@/components/article/ArticleHeroCard";
import Image from "next/image";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ArrowLeft, Calendar, Clock, PenLine, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/ui/motion";
import { SlideIn } from "@/components/ui/SlideIn";
import { requireAdmin } from "@/lib/auth";
import { SectionHeader } from "@/components/layout/SectionHeader";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  let articles: any[] = [];
  try {
    articles = await getArticles();
  } catch {}

  return articles.map((article: { slug: string }) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps & {
  searchParams: Promise<{ preview?: string; draft?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  let article: any = null;
  try {
    article = await getArticleBySlug(slug);
  } catch {}

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
      robots: { index: false, follow: false },
    };
  }

  const isPreview = query.preview === "true" || query.draft === "true";
  const metadataTitle = article.seoTitle || article.title;
  const metadataDescription = article.seoDescription || article.excerpt;

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
    title: metadataTitle,
    description: metadataDescription,
    authors: article.author ? [{ name: article.author }] : undefined,
    keywords: Array.isArray(article.tags) ? article.tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: metadataTitle,
      description: metadataDescription,
      siteName: siteConfig.name,
      locale: "id_ID",
      images: [{ url: coverImageUrl, width: 1200, height: 630, alt: article.title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(article.author ? { authors: [article.author] } : {}),
      ...(Array.isArray(article.tags) && article.tags.length ? { tags: article.tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description: metadataDescription,
      images: [coverImageUrl],
    },
    robots: isPreview || article.seoNoIndex
      ? { index: false, follow: false, noarchive: true }
      : { index: true, follow: true },
  };
}
export default async function ArtikelDetailPage({ params, searchParams }: PageProps & { searchParams: Promise<{ preview?: string; draft?: string; draftId?: string }> }) {
  const { slug } = await params;
  const { preview, draft, draftId } = await searchParams;
  
  let article: any = null;

  // If preview and draft are set, we fetch from the draft collection
  if (preview === "true" && draft === "true" && draftId) {
    if (!(await requireAdmin())) notFound();

    try {
      const token = process.env.SANITY_WRITE_TOKEN;
      if (token) {
        const previewClient = createClient({
          projectId: "ksc63oa8",
          dataset: "production",
          apiVersion: "2024-01-01",
          token: token,
          useCdn: false,
        });
        article = await previewClient.fetch(
          `*[_type == "article" && _id == $draftId][0] {
            title,
            "slug": slug.current,
            category,
            coverImage,
            excerpt,
            content,
            publishedAt,
            author
          }`,
          { draftId }
        );
      }
    } catch {}

  } else {
    try {
      article = await getArticleBySlug(slug);
    } catch {}

  }

  if (!article) {
    notFound();
  }

  // Safe helper to resolve cover image URL (declared BEFORE its use in JSON-LD).
  const getCoverImageUrl = () => {
    if (!article.coverImage) return "/placeholder.png";
    try {
      if (typeof article.coverImage === "object" && article.coverImage.asset) {
        return urlFor(article.coverImage).url();
      }
      if (typeof article.coverImage === "string") {
        return article.coverImage;
      }
    } catch {
      return "/placeholder.png";
    }
    return "/placeholder.png";
  };

  // Estimasi waktu baca: ~200 kata/menit untuk teks bahasa Indonesia.
  const getReadingMinutes = () => {
    const content = article.content;
    let raw = "";
    if (typeof content === "string") {
      raw = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    } else if (Array.isArray(content)) {
      // Portable Text — ekstrak hanya teks dari children.
      const walk = (nodes: unknown[]): string =>
        nodes
          .map((n) => {
            const node = n as { children?: unknown[]; text?: string };
            if (node.children) return walk(node.children);
            return node.text ?? "";
          })
          .join(" ");
      raw = walk(content).replace(/\s+/g, " ").trim();
    }
    const wordCount = raw.split(" ").filter(Boolean).length;
    return Math.max(1, Math.round(wordCount / 200));
  };

  // Artikel terkait: prioritas kategori sama, fallback artikel terbaru.
  let related: ArticlesListResult = [];
  try {
    related = await getArticlesByCategory(article.category as never);
    related = related.filter((a) => a.slug !== article.slug).slice(0, 3);
  } catch {
    related = [];
  }
  if (related.length === 0) {
    try {
      const all = await getArticles();
      related = all.filter((a) => a.slug !== article.slug).slice(0, 3);
    } catch {
      related = [];
    }
  }

  const headersList = await headers();
  const nonce = headersList.get("x-nonce") ?? undefined;
  const articleJsonLd = buildArticleJsonLd({
    slug: article.slug,
    title: article.title,
    description: article.excerpt,
    image: getCoverImageUrl().startsWith("http")
      ? getCoverImageUrl()
      : getAbsoluteUrl(getCoverImageUrl()),
    publishedAt:
      typeof article.publishedAt === "string"
        ? article.publishedAt
        : article.publishedAt instanceof Date
          ? article.publishedAt.toISOString()
          : new Date().toISOString(),
    ...(article.author ? { author: article.author } : {}),
    ...(article.category ? { category: article.category } : {}),
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Beranda", path: "/" },
    { name: "Artikel", path: "/artikel" },
    { name: article.title, path: `/artikel/${article.slug}` },
  ]);

  const readingMinutes = getReadingMinutes();

  return (
    <>
      <ArticleReadingBar />
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: articleJsonLd }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <div className="bg-white dark:bg-gray-950">
      <article>
        {/* Cover Image — -mt menarik gambar ke belakang navbar (pola PageHero)
            agar tidak ada gap seukuran navbar di atas. */}
        <FadeIn direction="down">
        <div className="relative h-[250px] md:h-[450px] w-full overflow-hidden -mt-[88px] sm:-mt-[96px] z-0">
          <Image
            src={getCoverImageUrl()}
            alt={article.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* Overlay gradasi agar teks navbar tetap terbaca di atas gambar */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/5" />
        </div>
        </FadeIn>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 md:pt-10 relative z-10">
          {/* Back Button — outline dulu, fill saat hover (pola CTA konsisten) */}
          <TransitionLink
            href="/artikel"
            className="group/back relative isolate inline-flex items-center gap-2 overflow-hidden rounded-full border-2 border-forest-600 dark:border-lime bg-transparent px-5 py-2.5 text-sm font-bold text-forest-700 dark:text-lime shadow-sm transition-all duration-300 hover:shadow-md hover:border-lime dark:hover:border-lime mb-8 cursor-pointer active:scale-95 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-forest-600 dark:bg-lime motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-0 group-hover/back:translate-x-0"
            />
            <span className="relative z-10 inline-flex items-center gap-2 transition-colors duration-300 motion-reduce:transition-none group-hover/back:text-white dark:group-hover/back:text-forest-950">
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 motion-safe:group-hover/back:-translate-x-1 motion-reduce:transform-none" />
              Kembali ke Daftar Artikel
            </span>
          </TransitionLink>

          {/* Meta Info — kartu header di atas konten */}
          <FadeIn direction="up" delay={0.1}>
          <header className="mb-10">
            <h1 className="text-[1.7rem] md:text-5xl font-black text-gray-900 dark:text-white mb-5 leading-[1.15] tracking-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-semibold text-gray-500 dark:text-gray-400 border-y border-gray-100 dark:border-gray-800 py-4">
              {article.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              )}
              {article.author && (
                <div className="flex items-center gap-1.5">
                  <PenLine className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
                  <span>{article.author}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
                <span>{readingMinutes} menit baca</span>
              </div>
              <ShareButton
                title={article.title}
                text={`${article.title} — ${article.excerpt ?? "Baca selengkapnya di website JN UKMI UNS."}`}
                url={`/artikel/${article.slug}`}
                className="ml-auto"
              />
            </div>
          </header>
          </FadeIn>

          {/* Article Content — kolom sempit (measure ~70ch) agar nyaman dibaca */}
          <FadeIn delay={0.2}>
          <div className="article-body max-w-3xl mx-auto">
            <ArticleBody content={article.content} />
          </div>
          </FadeIn>

        </div>
      </article>

      {/* Artikel Terkait */}
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
          <SlideIn direction="left">
            <SectionHeader
              icon={<Sparkles className="w-6 h-6" />}
              title="Artikel Terkait"
              subtitle="Lanjutkan membaca — artikel pilihan dengan tema serupa"
            />
          </SlideIn>
          {/* Mobile view — horizontal card layout (gambar kiri, teks kanan) */}
          <div className="md:hidden space-y-3">
            {related.map((a) => (
              <ArticleHeroCard key={a.slug} article={a} />
            ))}
          </div>

          {/* Desktop view — grid 2/3 cards */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((a, i) => (
              <SlideIn key={a.slug} direction={i % 2 === 0 ? "left" : "right"}>
                <ArticleCard article={a} />
              </SlideIn>
            ))}
          </div>
        </section>
      )}
    </div>
    </>
  );
}
