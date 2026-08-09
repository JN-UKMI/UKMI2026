"use client";

import { useState } from "react";
import { Check, RotateCcw, Copy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type DoaCardProps = {
  index: number;
  title?: string;
  arabic: string;
  latin: string;
  terjemahan: string;
  repeat?: number;
  showLatin: boolean;
  showTranslation: boolean;
};

export function DoaCard({
  index,
  title,
  arabic,
  latin,
  terjemahan,
  repeat = 1,
  showLatin,
  showTranslation,
}: DoaCardProps) {
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const increment = (e: React.MouseEvent) => {
    e.preventDefault();
    if (count < repeat) {
      setCount(count + 1);
    }
  };

  const reset = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCount(0);
  };

  const isCompleted = count === repeat;

  return (
    <motion.div
      onClick={increment}
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      className={`group relative bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-6 shadow-sm border-2 transition-all duration-500 cursor-pointer select-none flex flex-col gap-4 hover:shadow-lg hover:shadow-forest-900/5 dark:hover:shadow-lime/10 ${
        isCompleted
          ? "border-lime dark:border-lime bg-lime/5 dark:bg-lime/10 shadow-lime/5"
          : count > 0
          ? "border-forest-400 dark:border-forest-400 bg-forest-50/20 dark:bg-gray-850"
          : "border-forest-600 dark:border-lime hover:shadow-md"
      }`}
    >
      {/* Top Header: Index, Title & Counter Action */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100/60 dark:border-gray-800">
        <div className="flex items-center gap-3">
          {/* Circle Badge Nomor Ayat */}
          <span
            className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
              isCompleted
                ? "bg-lime text-white"
                : count > 0
                ? "bg-forest-400 text-white"
                : "bg-forest-600 dark:bg-lime dark:text-forest-950 text-white"
            }`}
          >
            {index}
          </span>
          {title && (
            <h4 className="font-bold text-gray-800 dark:text-gray-100 text-xs md:text-sm tracking-tight line-clamp-1">
              {title}
            </h4>
          )}
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {/* Target Counter */}
          <button
            onClick={increment}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              isCompleted
                ? "bg-lime text-white shadow-sm shadow-lime/20"
                : count > 0
                ? "bg-forest-600 dark:bg-forest-700 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                Selesai
              </>
            ) : (
              <>
                <span className="font-mono">{count}</span>
                <span className="text-gray-400 dark:text-gray-500">/</span>
                <span className="font-mono">{repeat}x</span>
              </>
            )}
          </button>

          {/* Reset & Copy Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              let copyText = `${title || "Doa"}\n\n${arabic}`;
              if (showLatin) copyText += `\n\nLatin:\n${latin}`;
              if (showTranslation) copyText += `\n\nArtinya:\n"${terjemahan}"`;
              navigator.clipboard.writeText(copyText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            title="Salin Doa"
            className="p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-forest-600 dark:hover:text-lime hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-forest-600 dark:text-lime" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {count > 0 && (
            <button
              onClick={reset}
              title="Reset hitungan"
              className="p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Arabic Text Block (Boxed container like DoaDoaList) */}
      <div className="py-5 px-4 sm:px-6 bg-gray-50/80 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/60 text-right overflow-x-auto">
        <p
          className="font-masurat text-2xl sm:text-3xl leading-[2.6] text-forest-900 dark:!text-white select-all"
          dir="rtl"
          lang="ar"
        >
          {arabic}
        </p>
      </div>

      {/* Transliteration & Translation */}
      {(showLatin || showTranslation) && (
        <div className="space-y-2 select-text transition-all duration-300">
          {showLatin && (
            <div className="text-sm font-semibold text-forest-800 dark:!text-white leading-relaxed italic bg-emerald-50/40 dark:bg-gray-800/80 p-3.5 rounded-xl border border-emerald-100/60 dark:border-gray-700">
              “{latin}”
            </div>
          )}
          {showTranslation && (
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed px-1">
              <strong className="text-gray-900 dark:text-lime font-bold block mb-1">Artinya:</strong>
              “{terjemahan}”
            </div>
          )}
        </div>
      )}

      {/* Helpful Hint on Hover */}
      {count === 0 && (
        <span className="absolute bottom-2 right-4 text-[10px] text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Klik kartu untuk menghitung
        </span>
      )}
    </motion.div>
  );
}
