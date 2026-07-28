import { HeroSection } from "@/components/home/HeroSection";
import { QuoteSection } from "@/components/home/QuoteSection";
import { KegiatanSeruSection } from "@/components/home/KegiatanSeruSection";
import { ArtikelTerbaruSection } from "@/components/home/ArtikelTerbaruSection";
import { KalenderSection } from "@/components/home/KalenderSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { loadTestimoni, loadKegiatanSeru } from "@/lib/content";
import { getArticles, type ArticlesListResult } from "@/lib/sanity";
import { buildPageMetadata } from "@/lib/page-metadata";
import { Analytics } from '@vercel/analytics/next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = buildPageMetadata({
  title: "Beranda",
  description:
    "Website resmi Jamaah Nurul Huda UKMI Universitas Sebelas Maret. Organisasi kemahasiswaan Islam yang berkomitmen membina generasi Qur'ani melalui dakwah, kajian, dan pengabdian.",
  path: "/",
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
