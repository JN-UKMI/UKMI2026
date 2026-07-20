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
      {/* Filosofi Logo (styled as Hero) */}
      <section className="relative min-h-[450px] -mt-[80px] overflow-hidden flex items-center justify-center py-20 px-4">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/image/ukmi-hero.jpg)" }}
        />

        {/* Diagonal overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/80 via-forest-900/80 to-black/80" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white pt-[80px] max-w-4xl mx-auto">
          <Image
            src="/image/logo-jnukmi.svg"
            alt="Logo JN UKMI"
            width={120}
            height={120}
            className="mx-auto mb-6 drop-shadow-md"
          />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Kabinet Iskandar Muda
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-lime">
            Filosofi Logo
          </h2>
          <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-3xl mx-auto font-medium">
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
