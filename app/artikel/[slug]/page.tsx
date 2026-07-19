import type { Metadata } from "next";
import { getArticles, getArticleBySlug, urlFor } from "@/lib/sanity";
import type { Article } from "@/lib/types";
import { ArticleBody } from "@/components/article/ArticleBody";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const revalidate = 60;

const categoryColors: Record<string, string> = {
  Kegiatan: "bg-lime/10 text-lime",
  Kajian: "bg-teal/10 text-teal",
  Isu: "bg-sage/10 text-sage",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article: { slug: string }) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  return {
    title: `${article.title} - JN UKMI`,
    description: article.excerpt,
  };
}

export default async function ArtikelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const categoryColor = categoryColors[article.category] || "bg-gray-200 text-gray-700";

  return (
    <div className="bg-white">
      <article>
        {/* Cover Image */}
        {article.coverImage && (
          <div className="relative h-[500px] w-full overflow-hidden">
            <Image
              src={urlFor(article.coverImage).url()}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Back Button */}
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-forest-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Artikel
          </Link>

          {/* Meta Info */}
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit">
              <Tag className="w-4 h-4" />
              <span>{article.category}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {article.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
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
                <div className="flex items-center gap-2">
                  <span>oleh {article.author}</span>
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <ArticleBody content={article.content} />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </div>
      </article>
    </div>
  );
}