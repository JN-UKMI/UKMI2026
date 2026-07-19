import type { ArticleListItem } from "@/lib/sanity";
import { ArticleCard } from "./ArticleCard";

export interface ArticleGridProps {
  articles: ArticleListItem[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}