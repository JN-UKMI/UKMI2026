"use client";

import Image from "next/image";
import { Calendar, Pencil } from "lucide-react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { ArticleListItem } from "@/lib/sanity";
import { resolveArticleCoverUrl } from "@/lib/article-cover";

/** Hero card untuk artikel - tampil di mobile (gambar kiri, teks kanan). */
export function ArticleHeroCard({ article }: { article: ArticleListItem }) {
  return (
    <TransitionLink
      href={`/artikel/${article.slug}`}
      className="group/herocard relative flex gap-3 sm:gap-4 overflow-hidden rounded-2xl border-2 border-forest-600 dark:border-lime bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50"
    >
      {/* Thumbnail kiri */}
      <div className="relative w-[42%] min-h-[150px] sm:min-h-[170px] bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
        <Image
          src={resolveArticleCoverUrl(article.coverImage)}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 motion-safe:group-hover/herocard:scale-110 motion-reduce:transform-none motion-reduce:transition-none"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 motion-safe:group-hover/herocard:opacity-100 transition-opacity motion-reduce:transition-none" />
      </div>

      {/* Teks kanan */}
      <div className="flex flex-col justify-center py-3 pr-3 sm:pr-4 min-w-0 flex-1">
        <h3 className="font-bold text-[15px] sm:text-base text-gray-900 dark:text-white leading-snug line-clamp-2 transition-colors duration-300 group-hover/herocard:text-forest-600 dark:group-hover/herocard:text-lime">
          {article.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium mt-2 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-forest-600 dark:text-lime" />
            {new Date(article.publishedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          {article.author && (
            <span className="flex items-center gap-1 min-w-0">
              <Pencil className="w-3 h-3 text-forest-600 dark:text-lime shrink-0" />
              <span className="truncate">{article.author}</span>
            </span>
          )}
        </div>
      </div>
    </TransitionLink>
  );
}
