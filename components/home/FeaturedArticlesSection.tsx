"use client";

import Image from "next/image";
import { Calendar, Tag, Sparkles } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { ArticleListItem } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

interface FeaturedArticlesSectionProps {
  articles: ArticleListItem[];
}

const categoryColors: Record<string, string> = {
  Kegiatan: "bg-forest-600/10 text-forest-700 border border-forest-600/20",
  Kajian: "bg-forest-600/10 text-forest-700 border border-forest-600/20",
  Isu: "bg-forest-600/10 text-forest-700 border border-forest-600/20",
};

export function FeaturedArticlesSection({
  articles,
}: FeaturedArticlesSectionProps) {
  if (articles.length === 0) {
    return (
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            icon={<Sparkles className="w-6 h-6" />}
            title="Artikel Unggulan"
            subtitle="Koleksi tulisan dan kajian pilihan JN UKMI"
          />
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
        <FadeIn className="mb-8">
          <SectionHeader
            icon={<Sparkles className="w-6 h-6" />}
            title="Artikel Unggulan"
            subtitle="Koleksi tulisan dan kajian pilihan JN UKMI"
          />
        </FadeIn>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <StaggerItem
              key={article.slug}
              className="flex flex-col h-full"
            >
            <TransitionLink
              href={`/artikel/${article.slug}`}
              className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-forest-600 dark:hover:border-lime hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                {article.coverImage ? (
                  <Image
                    src={urlFor(article.coverImage).url()}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-forest-100 to-forest-200" />
                )}
              </div>
              <div            className="p-5 flex flex-col flex-1 transition-colors">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${categoryColors[article.category] || "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"}`}
                  >
                    <Tag className="w-3 h-3 text-forest-600" />
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <Calendar className="w-3 h-3 text-forest-600" />
                    {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
              </div>
            </TransitionLink>
          </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
