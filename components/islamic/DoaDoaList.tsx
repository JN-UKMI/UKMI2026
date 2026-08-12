"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Copy, Check, BookOpen, Eye, EyeOff, Star } from "lucide-react";
import { SlideIn } from "@/components/ui/SlideIn";
import type { DoaItem } from "@/lib/types";

interface DoaDoaListProps {
  initialList: DoaItem[];
}

export function DoaDoaList({ initialList }: DoaDoaListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showLatin, setShowLatin] = useState(true);
  const [showTerjemahan, setShowTerjemahan] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Load doa favorit dari localStorage (satu kali saat mount).
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ukmi_doa_favorites");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved favorites once on mount
          setFavorites(parsed.filter((v) => typeof v === "string"));
        }
      }
    } catch {
      // localStorage tidak tersedia — abaikan.
    }
  }, []);

  const toggleFavorite = (itemId: string) => {
    const next = favorites.includes(itemId)
      ? favorites.filter((id) => id !== itemId)
      : [...favorites, itemId];
    setFavorites(next);
    try {
      localStorage.setItem("ukmi_doa_favorites", JSON.stringify(next));
    } catch {
      // abaikan
    }
  };

  const filteredList = initialList.filter((item, idx) => {
    const itemId = item.id || `doa-${idx}`;
    const matchesSearch =
      (item.judul || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.kategori || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.terjemahan || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.latin || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = !showFavoritesOnly || favorites.includes(itemId);
    return matchesSearch && matchesFavorite;
  });

  const handleCopy = async (id: string, text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Controls Bar: Search & Visibility Toggles */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-3xl border-2 border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime shadow-sm hover:shadow-md transition-all duration-300"
      >
        {/* Search Input Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            id="doa-search"
            type="text"
            aria-label="Cari doa"
            suppressHydrationWarning
            placeholder="Cari doa (misal: Pembuka Majelis, Belajar)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/90 border-2 border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime focus:border-lime dark:focus:border-lime rounded-2xl text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-forest-600/20 dark:focus:ring-lime/20 transition-all shadow-sm"
          />
        </div>

        {/* Toggle Buttons (Favorit, Latin, Terjemahan) — Always 1 single row on mobile */}
        <div className="flex flex-nowrap items-center gap-1 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end min-w-0">
          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            aria-pressed={showFavoritesOnly}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 shadow-sm border-2 cursor-pointer min-w-0 truncate hover:scale-105 active:scale-95 ${
              showFavoritesOnly
                ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500 dark:border-amber-400"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-forest-600 dark:border-lime hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-gray-750"
            }`}
          >
            <Star className={`w-3.5 h-3.5 shrink-0 ${showFavoritesOnly ? "fill-current" : ""}`} />
            <span className="truncate">Favorit ({favorites.length})</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            onClick={() => setShowLatin(!showLatin)}
            aria-pressed={showLatin}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 shadow-sm border-2 cursor-pointer min-w-0 truncate hover:scale-105 active:scale-95 ${
              showLatin
                ? "bg-forest-600 dark:bg-forest-700 hover:bg-forest-800 text-white border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime hover:text-forest-700 dark:hover:text-lime hover:bg-forest-50 dark:hover:bg-gray-750"
            }`}
          >
            {showLatin ? <EyeOff className="w-3.5 h-3.5 shrink-0" /> : <Eye className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate">Latin</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            onClick={() => setShowTerjemahan(!showTerjemahan)}
            aria-pressed={showTerjemahan}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 shadow-sm border-2 cursor-pointer min-w-0 truncate hover:scale-105 active:scale-95 ${
              showTerjemahan
                ? "bg-forest-600 dark:bg-forest-700 hover:bg-forest-800 text-white border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime hover:text-forest-700 dark:hover:text-lime hover:bg-forest-50 dark:hover:bg-gray-750"
            }`}
          >
            {showTerjemahan ? <EyeOff className="w-3.5 h-3.5 shrink-0" /> : <Eye className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate">Terjemahan</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Doa Cards Grid */}
      <div className="flex flex-col gap-6">
        {filteredList.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-200 dark:border-gray-800 shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-350 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">Doa yang Anda cari tidak ditemukan.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredList.map((item, idx) => {
            const itemId = item.id || `doa-${idx}`;
            let copyText = `${item.judul || "Doa"}\n\n${item.arabic}`;
            if (showLatin) copyText += `\n\nLatin:\n${item.latin}`;
            if (showTerjemahan) copyText += `\n\nArtinya:\n"${item.terjemahan}"`;
            
            const isCopied = copiedId === itemId;
            const direction = idx % 2 === 0 ? "left" : "right";

            return (
              <SlideIn key={itemId} direction={direction}>
              <motion.div
                exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-6 shadow-sm border-2 border-forest-600 dark:border-lime hover:shadow-xl hover:shadow-forest-900/10 dark:hover:shadow-lime/10 hover:border-lime dark:hover:border-lime motion-safe:hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 relative"
              >
                {/* Card Header: Title & Copy Button */}
                <div className="flex items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <h3 className="text-lg sm:text-xl font-black text-forest-900 dark:text-lime leading-snug">
                    {item.judul || `Doa #${idx + 1}`}
                  </h3>

                  <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(itemId)}
                    aria-pressed={favorites.includes(itemId)}
                    aria-label={favorites.includes(itemId) ? "Hapus dari favorit" : "Tandai doa favorit"}
                    title={favorites.includes(itemId) ? "Hapus dari Favorit" : "Tandai Favorit"}
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-300 cursor-pointer active:scale-95 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 ${
                      favorites.includes(itemId)
                        ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:border-amber-600 shadow-sm"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-400 dark:hover:border-amber-400"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${favorites.includes(itemId) ? "fill-current" : ""}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(itemId, copyText)}
                    aria-label={isCopied ? "Doa Tersalin" : "Salin Doa Lengkap"}
                    title={isCopied ? "Doa Tersalin!" : "Salin Doa Lengkap"}
                    className="inline-flex items-center justify-center gap-1.5 w-9 h-9 sm:w-auto sm:px-3 sm:py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-forest-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-forest-700 dark:hover:text-lime border border-gray-200 dark:border-gray-700 hover:border-forest-200 dark:hover:border-lime/60 hover:shadow-sm rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 shrink-0 text-forest-600 dark:text-lime" />
                        <span className="hidden sm:inline text-forest-600 dark:text-lime">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 shrink-0" />
                        <span className="hidden sm:inline">Salin Doa</span>
                      </>
                    )}
                  </button>
                  </div>
                </div>

                {/* Fadhilah / Keutamaan */}
                {item.fadhilah && (
                  <div className="bg-forest-50/70 dark:bg-forest-950/40 border border-forest-100 dark:border-forest-900/60 rounded-xl p-3 text-xs text-forest-900 dark:text-gray-200 leading-relaxed font-medium">
                    <strong className="text-forest-700 dark:text-lime">Keutamaan & Penggunaan:</strong> {item.fadhilah}
                  </div>
                )}

                {/* Arabic Text (RTL Large) */}
                <div className="py-5 px-4 sm:px-6 bg-gray-50/80 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/60 text-right overflow-x-auto">
                  <p
                    className="font-uthmanic text-2xl sm:text-3xl leading-[2.6] text-gray-900 dark:text-white select-all"
                    dir="rtl"
                  >
                    {item.arabic}
                  </p>
                </div>

                {/* Latin Transliteration (Conditional) */}
                {showLatin && (
                  <div className="text-sm font-semibold text-forest-800 dark:text-white leading-relaxed italic bg-emerald-50/40 dark:bg-gray-800/80 p-3.5 rounded-xl border border-emerald-100/60 dark:border-gray-700 transition-all animate-fadeIn text-justify">
                    “{item.latin}”
                  </div>
                )}

                {/* Indonesian Translation (Conditional) */}
                {showTerjemahan && (
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-all animate-fadeIn text-justify">
                    <strong className="text-gray-900 dark:text-lime font-bold block mb-1">Artinya:</strong>
                    “{item.terjemahan}”
                  </div>
                )}
              </motion.div>
              </SlideIn>
            );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
