import dynamicImport from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { QuoteSection } from "@/components/home/QuoteSection";
import { KegiatanSeruSection } from "@/components/home/KegiatanSeruSection";
import { ArtikelTerbaruSection } from "@/components/home/ArtikelTerbaruSection";
import { loadTestimoni, loadKegiatanSeru } from "@/lib/content";
import { getArticles, type ArticlesListResult } from "@/lib/sanity";
import { buildPageMetadata } from "@/lib/page-metadata";
import { Analytics } from '@vercel/analytics/next';

// Dynamic imports for below-the-fold heavy components (Code Splitting)
const KalenderSection = dynamicImport(
  () => import("@/components/home/KalenderSection").then((m) => m.KalenderSection)
);
const TestimonialSection = dynamicImport(
  () => import("@/components/home/TestimonialSection").then((m) => m.TestimonialSection)
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Beranda",
  description:
    "Website resmi JN UKMI UNS, organisasi Islam Universitas Sebelas Maret sejak 1991 untuk pembinaan mahasiswa, dakwah kampus, dan pengabdian.",
  path: "/",
  tags: ["JN UKMI", "JN UKMI UNS", "Rohis UNS", "Organisasi Islam UNS", "Nurul Huda UNS"],
});

export default async function Home() {
  const testimonials = await loadTestimoni();
  const kegiatanSeruList = await loadKegiatanSeru();

  let articles: ArticlesListResult = [];
  try {
    articles = await getArticles();
  } catch {
    articles = [];
  }

  return (
    <>
      <HeroSection />
      <QuoteSection />
      <KegiatanSeruSection initialEvents={kegiatanSeruList} />
      <ArtikelTerbaruSection articles={articles} />
      <KalenderSection />
      <TestimonialSection testimonials={testimonials} />
      <Analytics />
    </>
  );
}
