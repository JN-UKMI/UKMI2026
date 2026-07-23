import type { Metadata } from "next";
import { AlKahfiViewer } from "@/components/islamic/AlKahfiViewer";

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

import { PageHero } from "@/components/layout/PageHero";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <PageHero
        badge="Layanan Al-Qur'an"
        title={surah.namaLatin}
        subtitle={`Surah ke-${surah.nomor} · ${surah.tempatTurun} · ${surah.jumlahAyat} Ayat · (${surah.arti})`}
      />

      {/* Daftar Ayat dengan Progressive Loading & FAB */}
      <AlKahfiViewer ayatList={surah.ayat} />
    </div>
  );
}
