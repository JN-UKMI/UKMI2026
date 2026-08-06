"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Copy, Check, BookOpen, Sparkles, Eye, EyeOff } from "lucide-react";
import type { DoaItem } from "@/lib/types";

interface DoaDoaListProps {
  initialList: DoaItem[];
}

export function DoaDoaList({ initialList }: DoaDoaListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showLatin, setShowLatin] = useState(true);
  const [showTerjemahan, setShowTerjemahan] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const filteredList = initialList.filter(
    (item) =>
      (item.judul || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.kategori || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.terjemahan || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.latin || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors"
      >
        {/* Search Input Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            id="doa-search"
            type="text"
            aria-label="Cari doa"
            placeholder="Cari doa (misal: Pembuka Majelis, Belajar)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs sm:text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-forest-600 dark:focus:border-lime focus:ring-2 focus:ring-forest-600/20 dark:focus:ring-lime/20 transition-all"
          />
        </div>

        {/* Toggle Buttons (Hide/Show Latin & Terjemahan) */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            onClick={() => setShowLatin(!showLatin)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
              showLatin
                ? "bg-forest-600/10 dark:bg-forest-900/50 text-forest-700 dark:text-lime border-forest-600/20 dark:border-forest-800"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 line-through"
            }`}
          >
            {showLatin ? <Eye className="w-3.5 h-3.5 text-forest-600 dark:text-lime" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Latin</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            onClick={() => setShowTerjemahan(!showTerjemahan)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
              showTerjemahan
                ? "bg-forest-600/10 dark:bg-forest-900/50 text-forest-700 dark:text-lime border-forest-600/20 dark:border-forest-800"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 line-through"
            }`}
          >
            {showTerjemahan ? <Eye className="w-3.5 h-3.5 text-forest-600 dark:text-lime" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Terjemahan</span>
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

            return (
              <motion.div
                key={itemId}
                layout={!shouldReduceMotion}
                initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, x: -24 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-6 shadow-sm border border-l-4 border-l-forest-600 dark:border-l-lime border-gray-100 dark:border-gray-800 hover:shadow-lg hover:shadow-forest-900/5 dark:hover:shadow-lime/10 hover:border-gray-300 dark:hover:border-gray-700 motion-safe:hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 relative"
              >
                {/* Card Header: Category & Title & Copy Button */}
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <div className="flex flex-col gap-1.5">
                    {item.kategori && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-600/10 dark:bg-forest-900/50 text-forest-700 dark:text-lime rounded-full text-xs font-bold w-max">
                        <Sparkles className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
                        {item.kategori}
                      </span>
                    )}
                    <h3 className="text-lg sm:text-xl font-black text-forest-900 dark:text-lime leading-snug">
                      {item.judul || `Doa #${idx + 1}`}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(itemId, copyText)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-forest-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-forest-700 dark:hover:text-lime border border-gray-200 dark:border-gray-700 hover:border-forest-200 dark:hover:border-lime/60 hover:shadow-sm shrink-0 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40"
                    title="Salin Doa Lengkap"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-forest-600 dark:text-lime" />
                        <span className="text-forest-600 dark:text-lime">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Doa</span>
                      </>
                    )}
                  </button>
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
                  <div className="text-sm font-semibold text-forest-800 dark:text-white leading-relaxed italic bg-emerald-50/40 dark:bg-gray-800/80 p-3.5 rounded-xl border border-emerald-100/60 dark:border-gray-700 transition-all animate-fadeIn">
                    “{item.latin}”
                  </div>
                )}

                {/* Indonesian Translation (Conditional) */}
                {showTerjemahan && (
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-all animate-fadeIn">
                    <strong className="text-gray-900 dark:text-lime font-bold block mb-1">Artinya:</strong>
                    “{item.terjemahan}”
                  </div>
                )}
              </motion.div>
            );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
