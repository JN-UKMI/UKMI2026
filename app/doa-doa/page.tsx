import { buildPageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/layout/PageHero";
import { loadDoaDoa } from "@/lib/content";
import { DoaDoaList } from "@/components/islamic/DoaDoaList";
export const metadata = buildPageMetadata({
  title: 'Database Doa & Zikir',
  description: 'Kumpulan doa-doa pilihan dari Al-Qur\u2019an dan hadits shahih: doa harian, doa pembuka majelis, dan amalan untuk penuntut ilmu.',
  path: '/doa-doa',
});

export default async function DoaDoaPage() {
  const doaList = await loadDoaDoa();

  return (
    <div className="min-h-screen bg-transparent pb-20 transition-colors duration-300">
      <PageHero
        badge="Khazanah Keislaman"
        title="DOA & ZIKIR"
        subtitle="Kumpulan doa-doa pilihan dari Al-Qur'an dan Hadits shahih untuk amalan harian, majelis ilmu, dan penuntut ilmu."
      />

      <main className="max-w-4xl mx-auto px-4 pt-12">
        <DoaDoaList initialList={doaList} />
      </main>
    </div>
  );
}
