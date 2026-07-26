import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { QuoteSection } from "@/components/home/QuoteSection";
import { KegiatanSeruSection } from "@/components/home/KegiatanSeruSection";
import { ArtikelTerbaruSection } from "@/components/home/ArtikelTerbaruSection";
import { KalenderSection } from "@/components/home/KalenderSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { loadTestimoni, loadKegiatanSeru } from "@/lib/content";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export default async function Home() {
  const testimonials = await loadTestimoni();
  const kegiatanSeruList = await loadKegiatanSeru();

  return (
    <>
      <HeroSection />
      <QuoteSection />
      <KegiatanSeruSection initialEvents={kegiatanSeruList} />
      <ArtikelTerbaruSection />
      <KalenderSection />
      <TestimonialSection testimonials={testimonials} />
    </>
  );
}
