import { buildPageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/layout/PageHero";
import { loadUkmiStore } from "@/lib/content";
import { UkmiStoreClient } from "@/components/store/UkmiStoreClient";

export const metadata = buildPageMetadata({
  title: "UKMI Store - Open Rent Perlengkapan Acara",
  description: "Layanan sewa perlengkapan kegiatan & acara mahasiswa UNS dari JN UKMI. Alat lengkap, harga terjangkau, ramah kantong mahasiswa.",
  path: "/ukmi-store",
});

export default async function UkmiStorePage() {
  const data = await loadUkmiStore();

  return (
    <div className="min-h-screen bg-transparent pb-20 transition-colors duration-300">
      {/* Hero Banner Header */}
      <PageHero
        title={data.title}
        subtitle={data.description}
      />

      <UkmiStoreClient data={data} />
    </div>
  );
}
