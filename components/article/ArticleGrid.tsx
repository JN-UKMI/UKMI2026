"use client";

import { AnimatePresence } from "framer-motion";
import type { ArticleListItem } from "@/lib/sanity";
import { ArticleCard } from "./ArticleCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

export interface ArticleGridProps {
  articles: ArticleListItem[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <StaggerContainer
      // animate="show" keeps the container in "show" after the initial
      // whileInView trigger, so newly added children (from filter changes)
      // inherit the "show" variant without needing a full container remount.
      animate="show"
      className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-none md:grid md:grid-cols-2 md:overflow-x-visible md:pb-0 md:mx-0 md:px-0 lg:grid-cols-3 md:gap-6 items-stretch"
      staggerChildren={0.06}
    >
      <AnimatePresence mode="popLayout">
        {articles.map((article) => (
          <StaggerItem
            key={article.slug}
            layout
            // Exit animation — card fades out and slides down slightly
            // when filtered out. popLayout mode keeps surrounding cards
            // in place during the exit, preventing layout shifts.
            exit={{
              opacity: 0,
              y: 12,
              transition: { duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] },
            }}
            className="shrink-0 w-[85vw] max-w-[340px] snap-center md:w-auto md:max-w-none md:shrink flex flex-col h-full"
          >
            <ArticleCard article={article} />
          </StaggerItem>
        ))}
      </AnimatePresence>
    </StaggerContainer>
  );
}
