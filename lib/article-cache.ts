import type { ArticleListItem } from "@/lib/sanity";

const CACHE_KEY = "ukmi_articles_cache";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour — matches ISR revalidate

interface CacheEntry {
  data: ArticleListItem[];
  timestamp: number;
}

/**
 * Write the full article list to localStorage with a current timestamp.
 * Silently no-ops in SSR (no `window`).
 */
export function setCachedArticles(articles: ArticleListItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry = { data: articles, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Storage full or disabled — degrade gracefully
  }
}

/**
 * Read cached articles from localStorage.
 * Returns `null` when:
 *  - Running on the server (SSR)
 *  - No cache entry exists
 *  - The entry is older than CACHE_TTL_MS
 *  - The stored JSON is corrupt
 */
export function getCachedArticles(): ArticleListItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const entry: CacheEntry = JSON.parse(raw);
    if (!Array.isArray(entry?.data) || typeof entry?.timestamp !== "number") {
      return null;
    }

    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      // Stale — clean up so the next write starts fresh
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return entry.data;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

/**
 * Remove the article cache entry (e.g. after a manual refresh or admin update).
 */
export function clearCachedArticles(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}
