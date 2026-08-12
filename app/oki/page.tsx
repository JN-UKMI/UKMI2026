import { LdfCard } from "@/components/ldf/LdfCard";
import { loadOKI } from "@/lib/content";

import { PageHero } from "@/components/layout/PageHero";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SlideIn } from "@/components/ui/SlideIn";

export const metadata = buildPageMetadata({
  title: 'Ormawa Kerohanian Islam',
  description: 'Direktori Ormawa Kerohanian Islam (OKI) di UNS: profil organisasi mahasiswa Islam fakultas, media sosial, dan kontak masing-masing.',
  path: '/oki',
});

export default async function OkiPage() {
  const okiList = await loadOKI();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <PageHero badge="Jaringan Dakwah Kampus" title="Ormawa Kerohanian Islam" subtitle="Direktori Ormawa Kerohanian Islam (OKI) di lingkungan kampus Universitas Sebelas Maret" />
      <div className="mx-auto max-w-7xl py-10 sm:py-12 px-4 sm:px-6 lg:px-8">

        {okiList.length === 0 ? (
          <div className="text-center py-8 sm:py-10">
            <p className="text-lg text-slate-600 dark:text-gray-400">
              Belum ada data OKI yang tersedia
            </p>
          </div>
        ) : (
          <SlideIn direction="left" stagger className="flex flex-wrap justify-center gap-6">
            {okiList.map((oki) => (
              <div key={oki.nama} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-72">
                <LdfCard ldf={oki} />
              </div>
            ))}
          </SlideIn>
        )}
      </div>
    </main>
  );
}
