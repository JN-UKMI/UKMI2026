import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { ArticleListItem } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { SectionHeader } from "@/components/layout/SectionHeader";

interface UpcomingEventsSectionProps {
  articles: ArticleListItem[];
}

export function UpcomingEventsSection({
  articles,
}: UpcomingEventsSectionProps) {
  if (articles.length === 0) {
    return (
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <SectionHeader
          icon={<Calendar className="w-6 h-6" />}
          title="Kegiatan Terbaru"
          subtitle="Dokumentasi dan informasi agenda kegiatan terdekat JN UKMI"
        />
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
      <SectionHeader
        icon={<Calendar className="w-6 h-6" />}
        title="Kegiatan Terbaru"
        subtitle="Dokumentasi dan informasi agenda kegiatan terdekat JN UKMI"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/artikel/${article.slug}`}
            className="group overflow-hidden rounded-xl border border-gray-200 hover:shadow-lg hover:border-forest-600 transition-all duration-300 bg-white"
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
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-forest-600" />
                <time className="text-xs font-semibold text-gray-500">
                  {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-forest-600 transition-colors">
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
