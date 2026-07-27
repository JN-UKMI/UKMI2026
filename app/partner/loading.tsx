import { LdfCardSkeleton } from "@/components/ldf/LdfCardSkeleton";
import { PageHero } from "@/components/layout/PageHero";

export default function PartnerLoading() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <PageHero
        badge="Jaringan Dakwah Kampus"
        title="Partner Dakwah"
        subtitle="Direktori lembaga dan organisasi partner dakwah di lingkungan kampus Universitas Sebelas Maret"
      />
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <LdfCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
