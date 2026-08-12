import { LdfCard } from "@/components/ldf/LdfCard";
import { loadPartner } from "@/lib/content";

import { PageHero } from "@/components/layout/PageHero";
import { SlideIn } from "@/components/ui/SlideIn";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: 'Partner Dakwah',
  description: 'Direktori partner dakwah JN UKMI UNS: lembaga, UKM, dan organisasi mitra yang bersinergi dalam syiar islami di kampus Universitas Sebelas Maret.',
  path: '/partner',
});

export default async function PartnerPage() {
  const partnerList = await loadPartner();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <PageHero badge="Jaringan Dakwah Kampus" title="Partner Dakwah" subtitle="Direktori lembaga dan organisasi partner dakwah di lingkungan kampus Universitas Sebelas Maret" />
      <div className="mx-auto max-w-7xl py-10 sm:py-12 px-4 sm:px-6 lg:px-8">

        {partnerList.length === 0 ? (
          <div className="text-center py-8 sm:py-10">
            <p className="text-lg text-slate-600 dark:text-gray-400">
              Belum ada data Partner yang tersedia
            </p>
          </div>
        ) : (
          <SlideIn direction="left" stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {partnerList.map((partner) => (
              <div key={partner.nama} className="h-full">
                <LdfCard ldf={partner} />
              </div>
            ))}
          </SlideIn>
        )}
      </div>
    </main>
  );
}
