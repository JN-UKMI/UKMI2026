"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { ArticleListItem } from "@/lib/sanity";
import { ArticleGrid } from "./ArticleGrid";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const CATEGORY_OPTIONS = [
  { key: "", label: "Semua", short: "Semua" },
  { key: "Artikel Islami", label: "Artikel Islami", short: "Artikel" },
  { key: "Kajian Islami", label: "Kajian Islami", short: "Kajian" },
  { key: "Lainnya", label: "Lainnya", short: "Lainnya" },
];

const ITEMS_PER_PAGE = 6;

export interface ArticleListProps {
  articles: ArticleListItem[];
  initialCategory?: string;
  initialQuery?: string;
  initialPage?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function ArticleList({
  articles,
  initialCategory = "",
  initialQuery = "",
  initialPage = "1",
}: ArticleListProps) {
  const [category, setCategory] = useState<string>(initialCategory);
  const [query, setQuery] = useState<string>(initialQuery);
  const [page, setPage] = useState<number>(Math.max(1, Number(initialPage) || 1));
  const [searchInput, setSearchInput] = useState<string>(initialQuery);

  // ── Sync state → URL natively (history.replaceState avoids Next.js server roundtrip) ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query) params.set("q", query);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [category, query, page]);

  // ── Filter (category + search) ──
  const filteredArticles = useMemo(() => {
    let result = articles;
    if (category) {
      const cat = category.trim().toLowerCase();
      result = result.filter(
        (a) => (a.category || "").trim().toLowerCase() === cat
      );
    }
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((a) => {
        const title = (a.title || "").toLowerCase();
        const excerpt = (a.excerpt || "").toLowerCase();
        const author = (a.author || "").toLowerCase();
        return title.includes(q) || excerpt.includes(q) || author.includes(q);
      });
    }
    return result;
  }, [articles, category, query]);

  // ── Pagination (clamped inline — no state-during-effect) ──
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const safePage = clamp(page, 1, totalPages);
  const paginatedArticles = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, safePage]);

  // ── Handlers (updaters are pure — no nested setState calls) ──
  const handleCategoryClick = useCallback(
    (key: string) => {
      if (key === category) return;
      setCategory(key);
      setPage(1);
    },
    [category]
  );

  const handleSubmitSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const next = searchInput.trim();
      if (next === query) return;
      setQuery(next);
      setPage(1);
    },
    [searchInput, query]
  );

  const handleResetSearch = useCallback(() => {
    setSearchInput("");
    setQuery("");
    setPage(1);
  }, []);

  const handlePageChange = useCallback(
    (next: number) => {
      setPage(clamp(next, 1, totalPages));
    },
    [totalPages]
  );

  return (
    <div>
      {/* Search Bar + Category Tabs */}
      <div className="max-w-2xl mx-auto mb-10 space-y-5">
        <form
          onSubmit={handleSubmitSearch}
          className="relative w-full"
          role="search"
        >
          {category && <input type="hidden" name="category" value={category} />}
          <div className="relative flex items-center">
            <input
              type="text"
              name="q"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari artikel berdasarkan kata kunci atau judul..."
              className="w-full pl-11 pr-24 py-3 bg-gray-50 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-full text-xs md:text-sm font-medium focus:outline-none focus:border-forest-600 focus:bg-white dark:focus:bg-gray-900 transition-all shadow-inner"
              suppressHydrationWarning
            />
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-4 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 bg-forest-600 hover:bg-forest-800 text-white text-xs font-bold rounded-full transition-all cursor-pointer"
            >
              Cari
            </button>
          </div>
        </form>

        {/* Category filter chips — anchor elements so Cmd/Ctrl-click +
            middle-click still open the filtered URL in a new tab. Plain click
            is intercepted to handle state-based filtering without a server
            roundtrip. ARIA role is "button" with `aria-pressed` rather than
            "tab" because these are toggle chips, not navigation tabs. */}
        <div
          className="flex justify-center gap-1.5 sm:gap-2.5 overflow-x-auto px-1 py-0.5 -mx-1 scrollbar-none"
          role="group"
          aria-label="Filter kategori artikel"
        >
          {CATEGORY_OPTIONS.map((opt) => {
            const isActive = (opt.key || "") === category;
            const href = opt.key
              ? `/artikel?category=${encodeURIComponent(opt.key)}`
              : "/artikel";
            return (
              <a
                key={opt.key || "all"}
                href={href}
                role="button"
                aria-pressed={isActive}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => {
                  // Allow modifier-clicks (open in new tab) to pass through.
                  if (
                    e.metaKey ||
                    e.ctrlKey ||
                    e.shiftKey ||
                    e.altKey ||
                    e.button !== 0
                  ) {
                    return;
                  }
                  e.preventDefault();
                  handleCategoryClick(opt.key);
                }}
                className={`shrink-0 px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-forest-600 dark:focus-visible:outline-lime ${
                  isActive
                    ? "bg-forest-600 text-white border-forest-600"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <span className="sm:hidden">{opt.short || opt.label}</span>
                <span className="hidden sm:inline">{opt.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Search Query Info */}
      {query && (
        <div className="text-center mb-6 text-xs text-gray-500 dark:text-gray-400">
          Menampilkan hasil pencarian untuk kata kunci:{" "}
          <span className="font-bold text-forest-600 dark:text-lime">&quot;{query}&quot;</span>
          <button
            type="button"
            onClick={handleResetSearch}
            className="ml-2 text-xs underline text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
          >
            Reset Pencarian
          </button>
        </div>
      )}

      {/* Grid or empty state */}
      {paginatedArticles.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-800 rounded-2xl max-w-xl mx-auto">
          <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">
            Tidak ditemukan artikel yang sesuai.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          <ArticleGrid articles={paginatedArticles} />

          {totalPages > 1 && (
            <div
              className="flex items-center justify-center gap-2 pt-8 border-t border-gray-100 dark:border-gray-800 mt-12"
              role="navigation"
              aria-label="Pagination"
            >
              <button
                type="button"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                aria-disabled={safePage === 1}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  safePage === 1
                    ? "opacity-40 cursor-not-allowed border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer active:scale-95"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === safePage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      aria-current={isActive ? "page" : undefined}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-forest-600 text-white shadow-sm"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
                aria-disabled={safePage === totalPages}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  safePage === totalPages
                    ? "opacity-40 cursor-not-allowed border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer active:scale-95"
                }`}
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
