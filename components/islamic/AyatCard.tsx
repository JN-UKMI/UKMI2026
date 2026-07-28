import { useState } from "react";
import { Copy, Check, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { toArabicDigits } from "@/lib/utils";

type AyatCardProps = {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  showLatin: boolean;
  showTranslation: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
};

export function AyatCard({
  nomorAyat,
  teksArab,
  teksLatin,
  teksIndonesia,
  showLatin,
  showTranslation,
  isBookmarked = false,
  onToggleBookmark,
}: AyatCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let copyText = `Surat Al-Kahfi Ayat ${nomorAyat}\n\n${teksArab}`;
    if (showLatin) copyText += `\n\nLatin:\n${teksLatin}`;
    if (showTranslation) copyText += `\n\nArtinya:\n"${teksIndonesia}"`;

    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      id={`ayat-${nomorAyat}`}
      className={`group relative bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-6 shadow-sm border border-l-4 transition-all duration-300 flex flex-col gap-4 ${
        isBookmarked
          ? "border-l-amber-500 border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20"
          : "border-l-forest-600 dark:border-l-lime border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700"
      }`}
    >
      {/* Top Header: Verse Number Indicator & Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-forest-600/10 dark:bg-forest-900/50 text-forest-700 dark:text-lime font-mono border border-forest-600/20 dark:border-forest-800">
            Ayat {String(nomorAyat).padStart(2, "0")}
          </span>
          {isBookmarked && (
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-900/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
              Penanda Bacaan
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onToggleBookmark && (
            <button
              onClick={onToggleBookmark}
              className={`p-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                isBookmarked
                  ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title={isBookmarked ? "Hapus penanda bacaan" : "Tandai batas bacaan"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-white" : ""}`} />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-800 hover:bg-forest-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-forest-700 dark:hover:text-lime border border-gray-200 dark:border-gray-700 hover:border-forest-200 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
            title="Salin Ayat Lengkap"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
                <span className="text-forest-600 dark:text-lime">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Arabic Text Block */}
      <div className="py-5 px-4 sm:px-6 bg-gray-50/80 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/60 text-right overflow-x-auto">
        <p
          className="font-arabic text-2xl sm:text-3xl leading-[2.6] text-gray-900 dark:text-white select-all"
          dir="rtl"
        >
          {teksArab}
        </p>
      </div>

      {/* Latin Transliteration (Conditional) */}
      {showLatin && (
        <div className="text-sm font-semibold text-forest-800 dark:text-white leading-relaxed italic bg-emerald-50/40 dark:bg-gray-800/80 p-3.5 rounded-xl border border-emerald-100/60 dark:border-gray-700 transition-all animate-fadeIn">
          “{teksLatin}”
        </div>
      )}

      {/* Indonesian Translation (Conditional) */}
      {showTranslation && (
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-all animate-fadeIn">
          <strong className="text-gray-900 dark:text-lime font-bold block mb-1">Artinya:</strong>
          “{teksIndonesia}”
        </div>
      )}
    </motion.div>
  );
}
