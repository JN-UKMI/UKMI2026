"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ArticleListItem } from "@/lib/sanity";
import { ArticleCard } from "./ArticleCard";
import { ArticleHeroCard } from "./ArticleHeroCard";

export interface ArticleGridProps {
  articles: ArticleListItem[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) return null;

  return (
    <>
      {/* Mobile - semua card memakai style hero (gambar kiri, teks kanan) */}
      <div className="md:hidden space-y-3">
        {articles.map((article) => (
          <ArticleHeroCard key={article.slug} article={article} />
        ))}
      </div>

      {/* md+ - grid 2 kolom (tablet) / 3 kolom (desktop) dengan animasi filter */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 items-stretch">
        <AnimatePresence mode="popLayout">
          {articles.map((article) => (
            <motion.div
              key={article.slug}
              layout
              exit={{
                opacity: 0,
                y: 12,
                transition: { duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] },
              }}
              className="flex flex-col h-full"
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
