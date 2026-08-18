import { LdfCard } from "@/components/ldf/LdfCard";
import { loadLDF } from "@/lib/content";
import { PageHero } from "@/components/layout/PageHero";
import { SlideIn } from "@/components/ui/SlideIn";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: 'Lembaga Dakwah Fakultas',
  description: 'Direktori 12 Lembaga Dakwah Fakultas (LDF) di lingkungan UNS: profil, media sosial, dan kontak dakwah fakultas se-Surakarta.',
  path: '/ldf',
});

export default async function LdfPage() {
  const ldfList = await loadLDF();

  return (
    <main className="min-h-screen bg-transparent transition-colors duration-300">
      <PageHero
        badge="Jaringan Dakwah Kampus"
        title="Lembaga Dakwah Fakultas"
        subtitle="Direktori 12 Lembaga Dakwah Fakultas di lingkungan kampus Universitas Sebelas Maret"
      />
      <div className="mx-auto max-w-7xl py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        {ldfList.length === 0 ? (
          <div className="text-center py-8 sm:py-10">
            <p className="text-lg text-slate-600 dark:text-gray-400">
              Belum ada data LDF yang tersedia
            </p>
          </div>
        ) : (() => {
          // Chunk into rows of 4 - each row gets its own alternating SlideIn
          const chunkSize = 4;
          const rows: typeof ldfList[] = [];
          for (let i = 0; i < ldfList.length; i += chunkSize) {
            rows.push(ldfList.slice(i, i + chunkSize));
          }
          return (
            <div className="flex flex-col gap-6">
              {rows.map((row, rowIdx) => (
                <SlideIn
                  key={row[0].nama}
                  direction={rowIdx % 2 === 0 ? "left" : "right"}
                  stagger
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                >
                  {row.map((ldf) => (
                    <div key={ldf.nama}>
                      <LdfCard ldf={ldf} />
                    </div>
                  ))}
                </SlideIn>
              ))}
            </div>
          );
        })()}
      </div>
    </main>
  );
}
