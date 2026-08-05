"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Calendar, Pencil, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { ArticleListItem } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { SpotlightCard } from "@/components/ui/motion";

export interface ArticleCardProps {
  article: ArticleListItem;
  actions?: ReactNode;
}

export function ArticleCard({ article, actions }: ArticleCardProps) {
  const shouldReduceMotion = useReducedMotion();
  // Safe helper to resolve cover image URL
  const getCoverImageUrl = () => {
    const img: any = article.coverImage;
    if (!img) return "/placeholder.png";
    try {
      if (typeof img === "object" && img.asset) {
        return urlFor(img).url() || "/placeholder.png";
      }
      if (typeof img === "string" && img.trim() !== "") {
        return img;
      }
    } catch {
      return "/placeholder.png";
    }
    return "/placeholder.png";
  };

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.015 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className="h-full flex flex-col flex-1"
    >
      <SpotlightCard className="group flex flex-col h-full flex-1 bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-forest-600 dark:hover:border-lime shadow-sm hover:shadow-2xl dark:hover:shadow-[0_0_25px_rgba(73,154,19,0.35)] transition-all duration-500 overflow-hidden">
      <div className="flex flex-col h-full flex-1">
      <TransitionLink
        href={`/artikel/${article.slug}`}
        className="flex flex-col h-full flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest-600 dark:focus-visible:ring-lime"
      >
        {/* Thumbnail Image with Category Badge overlay */}
        <div className="relative w-full h-52 bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
          <Image
            src={getCoverImageUrl()}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Category Badge on top of image */}
          <span className="absolute top-3.5 left-3.5 z-10 inline-block px-3 py-1 bg-forest-600/90 dark:bg-forest-600/90 text-white dark:text-lime text-xs font-bold rounded-lg shadow-md backdrop-blur-xs border border-white/10">
            {article.category}
          </span>
        </div>

        <div className="flex flex-col flex-1 p-6 justify-between">
          <div>
            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white group-hover:text-forest-600 dark:group-hover:text-lime transition-colors mb-2.5 line-clamp-2 leading-snug">
              {article.title}
            </h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div>
            {/* Article Metadata info bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-800 mb-4">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
                {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Pencil className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
                {article.author || "Anonim"}
              </span>
            </div>

            {/* Center Pill Button with Icon Hover Animation */}
            <div className="w-full text-center py-2.5 px-4 rounded-full bg-forest-600 group-hover:bg-forest-800 dark:bg-lime dark:group-hover:bg-lime/90 text-white dark:text-forest-950 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-forest-600/25">
              <span>Baca Selengkapnya</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
            </div>
          </div>
        </div>
      </TransitionLink>
      {actions && (
        <div className="border-t border-gray-100 dark:border-gray-800 p-4">
          {actions}
        </div>
      )}
      </div>
      </SpotlightCard>
    </motion.div>
  );
}