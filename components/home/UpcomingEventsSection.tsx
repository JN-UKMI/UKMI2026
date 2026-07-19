import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { ArticleListItem } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";

interface UpcomingEventsSectionProps {
  articles: ArticleListItem[];
}

export function UpcomingEventsSection({
  articles,
}: UpcomingEventsSectionProps) {
  if (articles.length === 0) {
    return (
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-forest-900 mb-8">
          Kegiatan Terbaru
        </h2>
        <EmptyState
          title="Belum ada kegiatan"
          message="Kegiatan akan muncul di sini setelah ditambahkan."
        />
      </section>
    );
  }

  const displayedArticles = articles.slice(0, 3);

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-forest-900 mb-8">
        Kegiatan Terbaru
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/artikel/${article.slug}`}
            className="group overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
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
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-forest-600" />
                <time className="text-sm text-gray-600">
                  {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-forest-700">
                {article.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {article.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
