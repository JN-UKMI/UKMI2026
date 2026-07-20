import type { Metadata } from "next";
import sughraData from "@/content/sughra.json";
import kubraData from "@/content/kubra.json";
import { DoaTabs } from "@/components/islamic/DoaTabs";

import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Al-Ma'surat | JN UKMI",
  description: "Dzikir pagi & petang sesuai sunnah (Sughra & Kubra)",
};

export default function AlMasuratPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero title="Al-Ma'surat" subtitle="Dzikir pagi & petang sesuai sunnah (Sughra & Kubra)" />

      <DoaTabs sughra={sughraData} kubra={kubraData} />
    </div>
  );
}

