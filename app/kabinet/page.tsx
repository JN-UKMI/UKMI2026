import { Metadata } from "next";
import kabinetData from "@/content/kabinet/main.json";
import { PengurusUtamaGrid } from "@/components/cabinet/PengurusUtamaGrid";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Kabinet Iskandar Muda | JN UKMI",
  description: "Struktur kepengurusan Jamaah Nurul Huda UKMI",
};

export default function KabinetPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        badge="Kabinet Iskandar Muda"
        title="Struktur Kepengurusan"
        subtitle={kabinetData.filosofi_logo}
      />

      {/* Pengurus Utama */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <PengurusUtamaGrid members={kabinetData.pengurus} />
      </section>
    </div>
  );
}
