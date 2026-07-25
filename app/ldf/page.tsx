import { Metadata } from "next";
import { LdfCard } from "@/components/ldf/LdfCard";
import { loadLDF } from "@/lib/content";
import { PageHero } from "@/components/layout/PageHero";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Lembaga Dakwah Fakultas | LDF Directory",
  description: "Direktori Lembaga Dakwah Fakultas di kampus UNS",
};

export default async function LdfPage() {
  const ldfList = await loadLDF();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <PageHero
        badge="Jaringan Dakwah Kampus"
        title="Lembaga Dakwah Fakultas"
        subtitle="Direktori 12 Lembaga Dakwah Fakultas di lingkungan kampus Universitas Sebelas Maret"
      />
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
        {ldfList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600 dark:text-gray-400">
              Belum ada data LDF yang tersedia
            </p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {ldfList.map((ldf) => (
              <StaggerItem key={ldf.nama}>
                <LdfCard ldf={ldf} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </main>
  );
}
