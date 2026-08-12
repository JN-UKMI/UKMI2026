import { LdfCardSkeleton } from "@/components/ldf/LdfCardSkeleton";
import { PageHero } from "@/components/layout/PageHero";

export default function LdfLoading() {
  return (
    <main className="min-h-screen bg-transparent transition-colors duration-300">
      <PageHero
        badge="Jaringan Dakwah Kampus"
        title="Lembaga Dakwah Fakultas"
        subtitle="Direktori 12 Lembaga Dakwah Fakultas di lingkungan kampus Universitas Sebelas Maret"
      />
      <div className="mx-auto max-w-7xl py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <LdfCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
