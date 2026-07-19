import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { ArticleListItem } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";

interface FeaturedArticlesSectionProps {
  articles: ArticleListItem[];
}

const categoryColors: Record<string, string> = {
  Kegiatan: "bg-lime-100 text-lime-800",
  Kajian: "bg-teal-100 text-teal-800",
  Isu: "bg-sage-100 text-sage-800",
};

export function FeaturedArticlesSection({
  articles,
}: FeaturedArticlesSectionProps) {
  if (articles.length === 0) {
    return (
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-forest-900 mb-8">
            Artikel Unggulan
          </h2>
          <EmptyState
            title="Belum ada artikel unggulan"
            message="Artikel unggulan akan muncul di sini setelah diterbitkan."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-forest-900 mb-8">
          Artikel Unggulan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/artikel/${article.slug}`}
              className="group flex flex-col h-full bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                {article.coverImage ? (
                  <Image
                    src={urlFor(article.coverImage).url()}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-forest-100 to-forest-200" />
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || "bg-gray-200 text-gray-700"}`}
                  >
                    <Tag className="w-3 h-3" />
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-forest-700">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
