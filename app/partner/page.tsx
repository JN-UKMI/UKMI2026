import { Metadata } from "next";
import { LdfCard } from "@/components/ldf/LdfCard";
import { loadPartner } from "@/lib/content";

import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Partner Dakwah | Partner Directory",
  description: "Direktori Partner Dakwah di kampus UNS",
};

export default async function PartnerPage() {
  const partnerList = await loadPartner();

  return (
    <main className="min-h-screen bg-slate-50">
      <PageHero badge="Jaringan Dakwah Kampus" title="Partner Dakwah" subtitle="Direktori lembaga dan organisasi partner dakwah di lingkungan kampus Universitas Sebelas Maret" />
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">

        {partnerList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">
              Belum ada data Partner yang tersedia
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {partnerList.map((partner) => (
              <LdfCard key={partner.nama} ldf={partner} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
