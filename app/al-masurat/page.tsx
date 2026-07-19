import type { Metadata } from "next";
import doaHarian from "@/content/doa-harian.json";
import { DoaTabs } from "@/components/islamic/DoaTabs";

type Doa = {
  arabic: string;
  latin: string;
  terjemahan: string;
};

type DoaHarian = {
  pagi: Doa[];
  sore: Doa[];
};

export const metadata: Metadata = {
  title: "Al-Ma'surat | JN UKMI",
  description: "Dzikir pagi & petang sesuai sunnah",
};

const data = doaHarian as DoaHarian;

export default function AlMasuratPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-forest-900 to-forest-600 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Al-Ma&rsquo;surat
          </h1>
          <p className="text-lg text-forest-400">
            Dzikir pagi & petang sesuai sunnah
          </p>
        </div>
      </div>

      <DoaTabs pagi={data.pagi} sore={data.sore} />
    </div>
  );
}
