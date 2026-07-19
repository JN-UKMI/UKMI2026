import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards } from "@/components/home/FeatureCards";
import { ContentColumns } from "@/components/home/ContentColumns";

export const metadata: Metadata = {
  title: "Beranda | JN UKMI",
  description:
    "Website resmi Jamaah Nurul Huda UKMI Universitas Sebelas Maret. Organisasi kemahasiswaan Islam yang berkomitmen membina generasi qurani.",
  openGraph: {
    title: "Beranda | JN UKMI",
    description:
      "Website resmi Jamaah Nurul Huda UKMI Universitas Sebelas Maret. Organisasi kemahasiswaan Islam yang berkomitmen membina generasi qurani.",
    type: "website",
    locale: "id_ID",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <ContentColumns />
    </>
  );
}
