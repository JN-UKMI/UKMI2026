"use client";

import { useEffect, useMemo } from "react";
import type { ArticleListItem } from "@/lib/sanity";
import { setCachedArticles, getCachedArticles } from "@/lib/article-cache";
import { ArticleList } from "./ArticleList";

interface ArticleCacheHydratorProps {
  /** Fresh articles from the server (Sanity or ISR cache). */
  serverArticles: ArticleListItem[];
  /**
   * Whether the server data came from Sanity (true) or is a fallback
   * after a fetch failure (false). Only fresh data is persisted to
   * localStorage so a temporary Sanity outage doesn't overwrite the
   * real cache with dummy entries.
   */
  fresh: boolean;
  /**
   * Fallback shown when both server and cache are empty.
   */
  fallbackArticles: ArticleListItem[];
  initialCategory?: string;
  initialQuery?: string;
  initialPage?: string;
}

/**
 * Thin client wrapper that:
 * 1. Writes freshly-fetched server articles to localStorage on mount
 *    (only when `fresh === true` to avoid caching dummy fallback data).
 * 2. Falls back to cached articles when the server returns empty
 *    (Sanity unreachable / ISR miss).
 * 3. Falls back to the provided list if cache is also empty.
 *
 * The cache survives hard refreshes and tab closes, giving the user
 * instant content while the ISR revalidation runs in the background.
 */
export function ArticleCacheHydrator({
  serverArticles,
  fresh,
  fallbackArticles,
  initialCategory,
  initialQuery,
  initialPage,
}: ArticleCacheHydratorProps) {
  // ── Cache fresh server data ──────────────────────────────
  useEffect(() => {
    if (fresh && serverArticles.length > 0) {
      setCachedArticles(serverArticles);
    }
  }, [fresh, serverArticles]);

  // ── Resolve the article list (memoized — localStorage read is sync) ─
  const articles = useMemo(() => {
    if (serverArticles.length > 0) return serverArticles;

    // Server returned nothing — try localStorage cache
    const cached = getCachedArticles();
    if (cached && cached.length > 0) return cached;

    // Last resort: built-in dummy articles
    return fallbackArticles;
  }, [serverArticles, fallbackArticles]);

  return (
    <ArticleList
      articles={articles}
      initialCategory={initialCategory}
      initialQuery={initialQuery}
      initialPage={initialPage}
    />
  );
}
