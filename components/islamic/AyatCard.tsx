type AyatCardProps = {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
};

export function AyatCard({
  nomorAyat,
  teksArab,
  teksLatin,
  teksIndonesia,
}: AyatCardProps) {
  return (
    <div
      id={`ayat-${nomorAyat}`}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-start gap-4">
        <span className="shrink-0 w-9 h-9 rounded-full bg-forest-400/20 text-forest-600 flex items-center justify-center text-sm font-semibold">
          {nomorAyat}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className="text-2xl md:text-3xl leading-[2.2] text-right font-arabic mb-4"
            style={{ fontFamily: "serif" }}
            dir="rtl"
          >
            {teksArab}
          </p>
          <p className="text-sm text-gray-500 italic mb-1">{teksLatin}</p>
          <p className="text-gray-700 leading-relaxed">{teksIndonesia}</p>
        </div>
      </div>
    </div>
  );
}
