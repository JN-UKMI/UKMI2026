import Image from "next/image";
import Link from "next/link";
import { Tag } from "lucide-react";
import type { ArticleListItem } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";

export interface ArticleCardProps {
  article: ArticleListItem;
}

const categoryColors: Record<string, string> = {
  Kegiatan: "bg-lime/10 text-lime",
  Kajian: "bg-teal/10 text-teal",
  Isu: "bg-sage/10 text-sage",
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group flex flex-col h-full bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
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
          <div className="w-full h-full bg-gradient-to-br from-forest-400/20 to-forest-600/20" />
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category] || "bg-gray-200 text-gray-700"}`}
          >
            <Tag className="w-3 h-3" />
            {article.category}
          </span>
          <div className="text-xs text-gray-500">
            {new Date(article.publishedAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-forest-700">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 flex-1">{article.excerpt}</p>
      </div>
    </Link>
  );
}