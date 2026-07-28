import kabinetData from "@/content/kabinet/main.json";
import { PengurusUtamaGrid } from "@/components/cabinet/PengurusUtamaGrid";
import { PageHero } from "@/components/layout/PageHero";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: 'Kabinet Iskandar Muda',
  description: 'Struktur kepengurusan Jamaah Nurul Huda UKMI',
  path: '/kabinet',
});

export default function KabinetPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <PageHero
        badge="Kabinet Iskandar Muda"
        title="Struktur Kepengurusan"
        subtitle={kabinetData.filosofi_logo}
      />

      {/* Pengurus Utama */}
      <PengurusUtamaGrid members={kabinetData.pengurus} />
    </div>
  );
}
