import type { Metadata } from "next";
import { AlKahfiViewer } from "@/components/islamic/AlKahfiViewer";
import { PageHero } from "@/components/layout/PageHero";
import { loadAlKahfi } from "@/lib/content";

export const metadata: Metadata = {
  title: "Surah Al-Kahfi | JN UKMI",
  description: "Baca Surah Al-Kahfi lengkap dengan teks Arab dan terjemahan Indonesia",
};

export default async function AlKahfiPage() {
  const surah = await loadAlKahfi();

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
    <div className="min-h-screen bg-transparent transition-colors duration-300">
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
