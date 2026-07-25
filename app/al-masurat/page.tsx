import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { DoaTabs } from "@/components/islamic/DoaTabs";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Al-Ma'surat | JN UKMI",
  description: "Dzikir pagi & petang sesuai sunnah (Sughra & Kubra)",
};

// Read JSON files at request time via fs (not bundled into JS chunk)
// This keeps the 80KB + 124KB JSON out of the client bundle entirely
async function loadMasuratData(filename: string) {
  const filePath = path.join(process.cwd(), "content", "al-masurat", filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export default async function AlMasuratPage() {
  const [sughraData, kubraData] = await Promise.all([
    loadMasuratData("sughra.json"),
    loadMasuratData("kubra.json"),
  ]);

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <PageHero badge="Layanan Islam" title="Al-Ma'surat" subtitle="Dzikir pagi & petang sesuai sunnah (Sughra & Kubra)" />

      <DoaTabs sughra={sughraData} kubra={kubraData} />
    </div>
  );
}
