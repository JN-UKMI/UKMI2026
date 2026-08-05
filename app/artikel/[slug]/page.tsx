import type { Metadata } from "next";

import { headers } from "next/headers";
import { BASE_URL, getAbsoluteUrl, siteConfig } from "@/lib/seo";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { getArticles, getArticleBySlug, urlFor } from "@/lib/sanity";
import { createClient } from "next-sanity";
import { ArticleBody } from "@/components/article/ArticleBody";
import Image from "next/image";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ArrowLeft, Calendar, Tag, Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/ui/motion";
import { requireAdmin } from "@/lib/auth";

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

  return (
    <>
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
        {/* Cover Image */}
        <FadeIn direction="down">
        <div className="relative h-[250px] md:h-[450px] w-full overflow-hidden">
          <Image
            src={getCoverImageUrl()}
            alt={article.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
        </FadeIn>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Back Button */}
          <TransitionLink
            href="/artikel"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-forest-600 transition-colors mb-8 cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Artikel
          </TransitionLink>

          {/* Meta Info */}
          <FadeIn direction="up" delay={0.1}>
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-forest-50 border border-forest-150 rounded-full text-xs font-bold text-forest-600 mb-4 w-fit">
              <Tag className="w-3.5 h-3.5" />
              <span>{article.category}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
              {article.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-forest-600" />
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
                  <Pencil className="w-3.5 h-3.5 text-forest-600" />
                  <span>oleh {article.author}</span>
                </div>
              )}
            </div>
          </header>
          </FadeIn>

          {/* Article Content */}
          <FadeIn delay={0.2}>
          <div className="prose prose-forest dark:prose-invert prose-lg max-w-none mb-12">
            <ArticleBody content={article.content} />
          </div>
          </FadeIn>
        </div>
      </article>
    </div>
    </>
  );
}
