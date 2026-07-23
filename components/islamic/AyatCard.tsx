type AyatCardProps = {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  showLatin: boolean;
  showTranslation: boolean;
};

export function AyatCard({
  nomorAyat,
  teksArab,
  teksLatin,
  teksIndonesia,
  showLatin,
  showTranslation,
}: AyatCardProps) {
  return (
    <div
      id={`ayat-${nomorAyat}`}
      className="group relative bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-6 shadow-sm border border-l-4 border-l-forest-600 dark:border-l-lime border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 flex flex-col gap-4"
    >
      {/* Top Header: Verse Number Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-forest-600/10 dark:bg-forest-900/50 text-forest-700 dark:text-lime font-mono border border-forest-600/20 dark:border-forest-800">
            Ayat {String(nomorAyat).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Arabic Text Block (Boxed container like DoaDoaList) */}
      <div className="py-5 px-4 sm:px-6 bg-gray-50/80 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/60 text-right">
        <p
          className="font-arabic text-2xl sm:text-3xl leading-[2.2] text-gray-900 dark:text-white select-all"
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
    </div>
  );
}
