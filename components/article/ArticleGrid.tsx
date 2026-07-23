import type { ArticleListItem } from "@/lib/sanity";
import { ArticleCard } from "./ArticleCard";

export interface ArticleGridProps {
  articles: ArticleListItem[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-none md:grid md:grid-cols-2 md:overflow-x-visible md:pb-0 md:mx-0 md:px-0 lg:grid-cols-3 md:gap-6 items-stretch">
      {articles.map((article) => (
        <div key={article.slug} className="shrink-0 w-[85vw] max-w-[340px] snap-center md:w-auto md:max-w-none md:shrink flex flex-col h-full">
          <ArticleCard article={article} />
        </div>
      ))}
    </div>
  );
}