import { Metadata } from "next";
import Image from "next/image";
import kabinetData from "@/content/kabinet.json";
import { PengurusUtamaGrid } from "@/components/cabinet/PengurusUtamaGrid";

export const metadata: Metadata = {
  title: "Kabinet Iskandar Muda | JN UKMI",
  description: "Struktur kepengurusan Jamaah Nurul Huda UKMI",
};

export default function KabinetPage() {
  return (
    <div className="min-h-screen">
      {/* Filosofi Logo */}
      <section className="bg-gradient-to-b from-forest-900 to-forest-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Image
            src="/image/logo-jnukmi.svg"
            alt="Logo JN UKMI"
            width={140}
            height={140}
            className="mx-auto mb-6"
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Filosofi Logo
          </h1>
          <p className="text-lg text-forest-400 leading-relaxed max-w-3xl mx-auto">
            {kabinetData.filosofi_logo}
          </p>
        </div>
      </section>

      {/* Pengurus Utama */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <PengurusUtamaGrid members={kabinetData.pengurus} />
      </section>
    </div>
  );
}
