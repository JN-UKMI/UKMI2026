import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { UpcomingEventsSection } from "@/components/home/UpcomingEventsSection";
import { FeaturedArticlesSection } from "@/components/home/FeaturedArticlesSection";
import { loadHome } from "@/lib/content";
import { getArticlesByCategory, getFeaturedArticles } from "@/lib/sanity";

export async function generateMetadata(): Promise<Metadata> {
  return {
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
}

export default async function Home() {
  const homeContent = await loadHome();
  const kegiatanArticles = await getArticlesByCategory("Kegiatan");
  const featuredArticles = await getFeaturedArticles();

  return (
    <div className="min-h-screen">
      <Hero tagline={homeContent.tagline} deskripsi={homeContent.deskripsi} />
      <UpcomingEventsSection articles={kegiatanArticles} />
      <FeaturedArticlesSection articles={featuredArticles} />
    </div>
  );
}
