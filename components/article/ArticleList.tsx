"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { ArticleListItem } from "@/lib/sanity";
import { ArticleGrid } from "./ArticleGrid";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

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

// Compact page list — tampilkan halaman tepi (1 & terakhir) + sekitar halaman aktif,
// sisanya diganti ellipsis. Contoh: 1 … 4 5 6 … 12
function getPageItems(total: number, current: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const items: (number | "ellipsis")[] = [];
  for (let p = 1; p <= total; p++) {
    const isEdge = p === 1 || p === total;
    const isNear = Math.abs(p - current) <= 1;
    if (isEdge || isNear) {
      items.push(p);
    } else if (items[items.length - 1] !== "ellipsis") {
      items.push("ellipsis");
    }
  }
  return items;
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
  const shouldReduceMotion = useReducedMotion();

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
              className="w-full pl-11 pr-24 py-3 bg-gray-50 dark:bg-gray-800/90 border-2 border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime focus:border-lime dark:focus:border-lime focus:bg-white dark:focus:bg-gray-900 rounded-full text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-forest-600/20 dark:focus:ring-lime/20 transition-all shadow-sm"
              suppressHydrationWarning
            />
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-4 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 bg-forest-600 hover:bg-forest-800 text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-forest-900/20 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/50"
            >
              Cari
            </button>
          </div>
        </form>

        {/* Category filter pills — TentangTabs style glass container */}
        <div
          className="flex justify-center"
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-full sm:rounded-2xl p-1.5 shadow-sm border-2 border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime flex flex-nowrap gap-1 overflow-x-auto scrollbar-none transition-all duration-300"
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
                className={`group/filter relative flex items-center justify-center gap-1.5 shrink-0 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime dark:focus-visible:outline-lime z-10 ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId={shouldReduceMotion ? undefined : "article-category-pill"}
                    transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-0 z-0 rounded-xl bg-forest-600 shadow-md shadow-forest-600/20"
                    aria-hidden
                  />
                )}
                <span className="relative z-10">
                  {opt.label}
                  {!isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-forest-600 dark:bg-lime transition-[width] duration-300 motion-reduce:transition-none group-hover/filter:w-full group-focus-visible/filter:w-full"
                    />
                  )}
                </span>
              </a>
            );
          })}
          </div>
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
            className="ml-2 text-xs underline underline-offset-2 text-gray-400 dark:text-gray-500 hover:text-forest-600 dark:hover:text-lime cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 rounded-sm"
          >
            Reset Pencarian
          </button>
        </div>
      )}

      {/* Grid or empty state */}
      {paginatedArticles.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/60 border border-lime/30 dark:border-lime/30 rounded-2xl max-w-xl mx-auto">
          <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">
            Tidak ditemukan artikel yang sesuai.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          <ArticleGrid articles={paginatedArticles} />

          {totalPages > 1 && (
            <div
              className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-8 border-t border-gray-100 dark:border-gray-800 mt-12"
              role="navigation"
              aria-label="Pagination"
            >
              {/* Prev — outline dulu, fill slide dari kiri saat hover (pola CTA konsisten) */}
              <button
                type="button"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                aria-disabled={safePage === 1}
                className={`${
                  safePage === 1
                    ? "inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-full text-xs font-bold border-2 border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 opacity-50 cursor-not-allowed"
                    : "group/prev relative isolate inline-flex items-center gap-1 overflow-hidden rounded-full border-2 border-forest-600 dark:border-lime bg-transparent px-3 sm:px-4 py-2 text-xs font-bold text-forest-700 dark:text-lime transition-all duration-300 cursor-pointer active:scale-95 motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:shadow-forest-600/20 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50"
                }`}
              >
                {safePage !== 1 && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-forest-600 dark:bg-lime motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-0 group-hover/prev:translate-x-0"
                  />
                )}
                <span
                  className={`relative z-10 inline-flex items-center gap-1 transition-colors duration-300 motion-reduce:transition-none ${
                    safePage !== 1
                      ? "group-hover/prev:text-white dark:group-hover/prev:text-forest-950"
                      : ""
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 transition-transform duration-300 motion-safe:group-hover/prev:-translate-x-1 motion-reduce:transform-none" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </span>
              </button>

              {/* Page numbers — pill aktif hijau penuh, idle outline → hover fill.
                  Dibatasi maksimal ~7 tombol, sisanya ellipsis. */}
              <div className="flex items-center gap-1.5">
                {getPageItems(totalPages, safePage).map((item, i) => {
                  if (item === "ellipsis") {
                    return (
                      <span
                        key={`ellipsis-${i}`}
                        aria-hidden
                        className="w-6 sm:w-8 flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-500 select-none"
                      >
                        …
                      </span>
                    );
                  }
                  const isActive = item === safePage;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handlePageChange(item)}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative isolate w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50 ${
                        isActive
                          ? "bg-forest-600 dark:bg-lime text-white dark:text-forest-950 border-2 border-forest-600 dark:border-lime shadow-md shadow-forest-600/25 scale-110"
                          : "border-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-600 dark:text-gray-300 hover:border-forest-600 dark:hover:border-lime hover:text-forest-700 dark:hover:text-lime hover:bg-forest-50 dark:hover:bg-forest-900/20 hover:shadow-sm motion-safe:hover:-translate-y-0.5 active:scale-95"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              {/* Next */}
              <button
                type="button"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
                aria-disabled={safePage === totalPages}
                className={`${
                  safePage === totalPages
                    ? "inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-full text-xs font-bold border-2 border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 opacity-50 cursor-not-allowed"
                    : "group/next relative isolate inline-flex items-center gap-1 overflow-hidden rounded-full border-2 border-forest-600 dark:border-lime bg-transparent px-3 sm:px-4 py-2 text-xs font-bold text-forest-700 dark:text-lime transition-all duration-300 cursor-pointer active:scale-95 motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:shadow-forest-600/20 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50"
                }`}
              >
                {safePage !== totalPages && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-forest-600 dark:bg-lime motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-0 group-hover/next:translate-x-0"
                  />
                )}
                <span
                  className={`relative z-10 inline-flex items-center gap-1 transition-colors duration-300 motion-reduce:transition-none ${
                    safePage !== totalPages
                      ? "group-hover/next:text-white dark:group-hover/next:text-forest-950"
                      : ""
                  }`}
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 motion-safe:group-hover/next:translate-x-1 motion-reduce:transform-none" />
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
