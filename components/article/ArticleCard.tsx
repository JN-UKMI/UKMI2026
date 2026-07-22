import Image from "next/image";
import Link from "next/link";
import { Calendar, Pencil } from "lucide-react";
import type { ArticleListItem } from "@/lib/sanity";
import { urlFor } from "@/lib/sanity";

export interface ArticleCardProps {
  article: ArticleListItem;
}

export function ArticleCard({ article }: ArticleCardProps) {
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
    <Link
      href={`/artikel/${article.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-gray-200 hover:border-forest-600 hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Thumbnail Image with Category Badge overlay */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        <Image
          src={getCoverImageUrl()}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300"
          unoptimized
        />
        {/* Category Badge on top of image */}
        <span className="absolute top-3 left-3 z-10 inline-block px-2.5 py-1 bg-forest-600 text-white text-xs font-bold rounded-md shadow">
          {article.category}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-semibold text-gray-900 group-hover:text-forest-600 transition-colors mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
          {article.excerpt}
        </p>

        {/* Article Metadata info bar */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-3 border-t border-gray-100 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-forest-600" />
            {new Date(article.publishedAt).toLocaleDateString("id-ID", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Pencil className="w-3.5 h-3.5 text-forest-600" />
            {article.author || "Anonim"}
          </span>
        </div>

        {/* Center Pill Button */}
        <div className="w-full text-center py-2 px-4 rounded-full bg-forest-600 group-hover:bg-forest-750 text-white text-xs font-bold transition-colors mt-4">
          Baca Selengkapnya
        </div>
      </div>
    </Link>
  );
}