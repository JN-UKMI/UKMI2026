import type { Metadata } from "next";
import { getArticles } from "@/lib/sanity";
import { ArticleGrid } from "@/components/article/ArticleGrid";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Artikel - JN UKMI",
  description: "Baca artikel tentang kegiatan, kajian, dan isu-isu terbaru dari JN UKMI",
};

export const dynamic = "force-static";
export const revalidate = 60;

const allCategories = ["Kegiatan", "Kajian", "Isu"] as const;
type Category = typeof allCategories[number];

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

async function getFilteredArticles(category?: Category) {
  if (category && category !== "Kegiatan" && category !== "Kajian" && category !== "Isu") {
    return [];
  }

  const articles = await getArticles();
  return category ? articles.filter((a) => a.category === category) : articles;
}

export default async function ArtikelPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const articles = await getFilteredArticles(category as Category);

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Artikel</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan artikel tentang kegiatan, kajian, dan isu-isu terbaru dari JN UKMI
          </p>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <a
            href="/artikel"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !category
                ? "bg-forest-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Semua
          </a>
          <a
            href="/artikel?category=Kegiatan"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === "Kegiatan"
                ? "bg-lime text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Kegiatan
          </a>
          <a
            href="/artikel?category=Kajian"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === "Kajian"
                ? "bg-teal text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Kajian
          </a>
          <a
            href="/artikel?category=Isu"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === "Isu" ? "bg-sage text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Isu
          </a>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Belum ada artikel dalam kategori ini.</p>
          </div>
        ) : (
          <ArticleGrid articles={articles} />
        )}
      </div>
    </div>
  );
}
