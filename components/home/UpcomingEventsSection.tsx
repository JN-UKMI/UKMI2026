"use client";

import Image from "next/image";
import { Calendar } from "lucide-react";
import { EmptyState } from "./EmptyState";
import type { ArticleListItem } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

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
      <FadeIn className="mb-8">
        <SectionHeader
          icon={<Calendar className="w-6 h-6" />}
          title="Kegiatan Terbaru"
          subtitle="Dokumentasi dan informasi agenda kegiatan terdekat JN UKMI"
        />
      </FadeIn>
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-visible">
        {displayedArticles.map((article, index) => (
          <StaggerItem
            key={article.slug}
            className={`block ${index > 0 ? "hidden md:block" : ""}`}
          >
            <TransitionLink
              href={`/artikel/${article.slug}`}
              className="group flex h-full overflow-visible rounded-xl border-2 border-forest-600 dark:border-lime bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-forest-600 dark:focus-visible:outline-lime hover:outline-2 hover:-outline-offset-1 hover:outline-forest-600 dark:hover:outline-lime"
            >
              <div className="relative h-full min-h-[8rem] w-32 sm:min-h-[9rem] sm:w-36 lg:w-40 shrink-0 self-stretch bg-gray-200 overflow-hidden">
                {article.coverImage ? (
                  <Image
                    src={urlFor(article.coverImage).url()}
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 128px, (max-width: 1024px) 144px, 160px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-forest-100 to-forest-200" />
                )}
              </div>
              <div className="flex-1 min-w-0 p-4 md:p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <Calendar className="w-4 h-4 text-forest-600 shrink-0" />
                  <time className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">
                    {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-2 group-hover:text-forest-600 dark:group-hover:text-lime transition-colors text-sm md:text-base">
                  {article.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </TransitionLink>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
