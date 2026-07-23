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
          <div className="flex flex-wrap justify-center gap-6">
            {partnerList.map((partner) => (
              <div key={partner.nama} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-72">
                <LdfCard ldf={partner} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
