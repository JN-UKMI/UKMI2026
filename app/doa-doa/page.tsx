import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { loadDoaDoa } from "@/lib/content";
import { DoaDoaList } from "@/components/islamic/DoaDoaList";

export const metadata: Metadata = {
  title: "Database Doa & Zikir | JN UKMI",
  description: "Kumpulan doa-doa pilihan dan doa pembuka majelis untuk diamalkan dalam kehidupan sehari-hari.",
};

export default async function DoaDoaPage() {
  const doaList = await loadDoaDoa();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 transition-colors duration-300">
      <PageHero
        badge="Khazanah Keislaman"
        title="DATABASE DOA & ZIKIR"
        subtitle="Kumpulan doa-doa pilihan dari Al-Qur'an dan Hadits shahih untuk amalan harian, majelis ilmu, dan penuntut ilmu."
      />

      <main className="max-w-4xl mx-auto px-4 pt-12">
        <DoaDoaList initialList={doaList} />
      </main>
    </div>
  );
}
