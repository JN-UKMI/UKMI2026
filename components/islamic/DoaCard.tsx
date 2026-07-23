"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";

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
    <div
      onClick={increment}
      className={`group relative bg-white rounded-2xl p-5 md:p-6 shadow-sm border transition-all duration-300 cursor-pointer select-none flex flex-col gap-4 border-l-4 active:scale-[0.98] ${
        isCompleted
          ? "border-l-lime border-gray-200 bg-lime/5 shadow-lime/5"
          : count > 0
          ? "border-l-forest-400 border-gray-200 bg-forest-50/20"
          : "border-l-forest-600 border-gray-100 hover:shadow-md hover:border-gray-200"
      }`}
    >
      {/* Top Header: Index, Title & Counter Action */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100/60">
        <div className="flex items-center gap-3">
          {/* Circle Badge Nomor Ayat */}
          <span
            className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
              isCompleted
                ? "bg-lime text-white"
                : count > 0
                ? "bg-forest-400 text-white"
                : "bg-forest-600 text-white"
            }`}
          >
            {index}
          </span>
          {title && (
            <h4 className="font-bold text-gray-800 text-xs md:text-sm tracking-tight line-clamp-1">
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
                ? "bg-forest-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                <span className="text-gray-400">/</span>
                <span className="font-mono">{repeat}x</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          {count > 0 && (
            <button
              onClick={reset}
              title="Reset hitungan"
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Arabic Text Block */}
      <p
        className="text-2xl md:text-3xl leading-[2.6] text-right text-forest-900 font-uthmanic select-text pt-2"
        dir="rtl"
        lang="ar"
      >
        {arabic}
      </p>

      {/* Transliteration & Translation */}
      {(showLatin || showTranslation) && (
        <div className="space-y-2 mt-2 select-text transition-all duration-300">
          {showLatin && (
            <p className="text-[12px] md:text-sm text-forest-600/90 font-medium leading-relaxed italic bg-forest-50/40 p-2.5 rounded-lg border border-forest-100/30">
              {latin}
            </p>
          )}
          {showTranslation && (
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed px-1">
              {terjemahan}
            </p>
          )}
        </div>
      )}

      {/* Helpful Hint on Hover */}
      {count === 0 && (
        <span className="absolute bottom-2 right-4 text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Klik kartu untuk menghitung
        </span>
      )}
    </div>
  );
}
