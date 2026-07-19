import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Surah Al-Kahfi | JN UKMI",
  description: "Baca Surah Al-Kahfi lengkap dengan teks Arab dan terjemahan Indonesia",
};

type Ayat = {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
};

type SurahData = {
  nomor: number;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: string;
  ayat: Ayat[];
};

async function getSurah(): Promise<SurahData | null> {
  try {
    const res = await fetch("https://equran.id/api/v2/surat/18", {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as SurahData;
  } catch {
    return null;
  }
}

export default async function AlKahfiPage() {
  const surah = await getSurah();

  if (!surah) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 text-lg">
            Gagal memuat data. Silakan muat ulang halaman.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-900 to-green-700 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-green-200 mb-1">
            Surah ke-{surah.nomor} · {surah.tempatTurun} · {surah.jumlahAyat} Ayat
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {surah.namaLatin}
          </h1>
          <p className="text-lg text-green-100">{surah.arti}</p>
        </div>
      </div>

      {/* Daftar Ayat */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {surah.ayat.map((ayat) => (
          <div
            key={ayat.nomorAyat}
            id={`ayat-${ayat.nomorAyat}`}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-9 h-9 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-sm font-semibold">
                {ayat.nomorAyat}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-2xl md:text-3xl leading-[2.2] text-right font-arabic mb-4"
                  style={{ fontFamily: "serif" }}
                  dir="rtl"
                >
                  {ayat.teksArab}
                </p>
                <p className="text-sm text-gray-500 italic mb-1">
                  {ayat.teksLatin}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {ayat.teksIndonesia}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
