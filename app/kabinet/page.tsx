import kabinetData from "@/content/kabinet/main.json";
import { PengurusUtamaGrid } from "@/components/cabinet/PengurusUtamaGrid";
import { LogoKabinetSection } from "@/components/cabinet/LogoKabinetSection";
import { PageHero } from "@/components/layout/PageHero";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: 'Kabinet Iskandar Muda',
  description: 'Kenali Kabinet Iskandar Muda JN UKMI UNS: struktur pengurus, filosofi logo, dan visi kepengurusan Unit Kegiatan Mahasiswa Islam UNS.',
  path: '/kabinet',
});

export default function KabinetPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <PageHero
        badge="Kabinet Iskandar Muda"
        title="Kabinet"
        subtitle={kabinetData.deskripsi_kabinet}
      />

      {/* Logo Section */}
      <LogoKabinetSection filosofi={kabinetData.filosofi_logo} items={kabinetData.filosofi_items} />

      {/* Pengurus Utama */}
      <PengurusUtamaGrid members={kabinetData.pengurus} />
    </div>
  );
}
