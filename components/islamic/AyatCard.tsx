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
      className="group relative bg-white rounded-2xl p-5 md:p-6 shadow-sm border transition-all duration-300 flex flex-col gap-4 border-l-4 border-l-forest-600 border-gray-100 hover:shadow-md hover:border-gray-200"
    >
      {/* Top Header: Verse Number Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100/60">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-mono">
            {String(nomorAyat).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Arabic Text Block */}
      <p
        className="text-2xl md:text-3xl leading-[2.2] text-right text-forest-900 font-arabic select-text font-medium pt-2"
        dir="rtl"
      >
        {teksArab}
      </p>

      {/* Transliteration & Translation */}
      {(showLatin || showTranslation) && (
        <div className="space-y-2 mt-2 select-text transition-all duration-300">
          {showLatin && (
            <p className="text-[12px] md:text-sm text-forest-600/90 font-medium leading-relaxed italic bg-forest-50/40 p-2.5 rounded-lg border border-forest-100/30">
              {teksLatin}
            </p>
          )}
          {showTranslation && (
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed px-1">
              {teksIndonesia}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
