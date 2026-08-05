import dynamicImport from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { QuoteSection } from "@/components/home/QuoteSection";
import { KegiatanSeruSection } from "@/components/home/KegiatanSeruSection";
import { ArtikelTerbaruSection } from "@/components/home/ArtikelTerbaruSection";
import { loadTestimoni, loadKegiatanSeru, loadMediaSpace } from "@/lib/content";
import { MediaSpaceSection } from "@/components/home/MediaSpaceSection";
import { getArticles, type ArticlesListResult } from "@/lib/sanity";
import { buildPageMetadata } from "@/lib/page-metadata";

// Dynamic imports for below-the-fold heavy components (Code Splitting)
const KalenderSection = dynamicImport(
  () => import("@/components/home/KalenderSection").then((m) => m.KalenderSection)
);
const TestimonialSection = dynamicImport(
  () => import("@/components/home/TestimonialSection").then((m) => m.TestimonialSection)
);

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
  const mediaSpaceItems = await loadMediaSpace();

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
      <MediaSpaceSection items={mediaSpaceItems} />
      <TestimonialSection testimonials={testimonials} />
    </>
  );
}
