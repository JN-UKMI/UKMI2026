import type { Metadata } from "next";
import { VisiMisiSection } from "@/components/about/VisiMisiSection";
import { TujuanSection } from "@/components/about/TujuanSection";
import { TimelineSection } from "@/components/about/TimelineSection";
import { loadAbout } from "@/lib/content";

export const generateMetadata = async (): Promise<Metadata> => {
  const { visi } = await loadAbout();

  return {
    title: "Tentang Kami — JN UKMI",
    description: visi,
    openGraph: {
      title: "Tentang Kami — JN UKMI",
      description: visi,
      type: "website",
      locale: "id_ID",
    },
  };
};

export default async function TentangPage() {
  const aboutData = await loadAbout();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-forest-900 mb-12 text-center">
          Tentang Kami
        </h1>
        <VisiMisiSection visi={aboutData.visi} misi={aboutData.misi} />
        <TujuanSection tujuan={aboutData.tujuan} />
        <TimelineSection timeline={aboutData.timeline} />
      </div>
    </div>
  );
}