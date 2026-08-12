import { LdfCardSkeleton } from "@/components/ldf/LdfCardSkeleton";
import { PageHero } from "@/components/layout/PageHero";

export default function OkiLoading() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <PageHero
        badge="Jaringan Dakwah Kampus"
        title="Ormawa Kerohanian Islam"
        subtitle="Direktori Ormawa Kerohanian Islam (OKI) di lingkungan kampus Universitas Sebelas Maret"
      />
      <div className="mx-auto max-w-7xl py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-72">
              <LdfCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
