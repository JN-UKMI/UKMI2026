import { Metadata } from "next";
import { LdfCard } from "@/components/ldf/LdfCard";
import { loadOKI } from "@/lib/content";

import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Ormawa Kerohanian Islam | OKI Directory",
  description: "Direktori Ormawa Kerohanian Islam di kampus UNS",
};

export default async function OkiPage() {
  const okiList = await loadOKI();

  return (
    <main className="min-h-screen bg-slate-50">
      <PageHero badge="Jaringan Dakwah Kampus" title="Ormawa Kerohanian Islam" subtitle="Direktori Ormawa Kerohanian Islam (OKI) di lingkungan kampus Universitas Sebelas Maret" />
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">

        {okiList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">
              Belum ada data OKI yang tersedia
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {okiList.map((oki) => (
              <LdfCard key={oki.nama} ldf={oki} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
