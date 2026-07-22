import type { Metadata } from "next";
import { getArticles } from "@/lib/sanity";
import { ArticleGrid } from "@/components/article/ArticleGrid";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pencil, Search, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Artikel - JN UKMI",
  description: "Baca artikel tentang kegiatan, kajian, dan isu-isu terbaru dari JN UKMI",
};

export const dynamic = "force-dynamic";

const allCategories = ["Kegiatan", "Kajian", "Isu", "Lainnya"] as const;
type Category = typeof allCategories[number];

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string; q?: string }>;
}

const dummyArticles = [
  {
    title: "[Kajian] Membangun Karakter Pemuda Muslim di Era Milenial",
    slug: "membangun-karakter-pemuda-muslim",
    excerpt: "Rangkuman kajian pekanan mengenai pilar-pilar karakter yang harus dimiliki pemuda Muslim untuk menghadapi tantangan zaman agar tetap istiqomah di tengah arus modernisasi global.",
    publishedAt: new Date().toISOString(),
    category: "Kajian" as const,
    author: "Humas JN UKMI",
  },
  {
    title: "[Kegiatan] Dokumentasi Rapat Kerja Kabinet Iskandar Muda",
    slug: "dokumentasi-raker-iskandar-muda",
    excerpt: "Laporan pelaksanaan rapat kerja kepengurusan JN UKMI untuk merumuskan program dakwah strategis selama satu periode ke depan, menyelaraskan visi misi bersama seluruh pengurus.",
    publishedAt: new Date().toISOString(),
    category: "Kegiatan" as const,
    author: "Sekretariat",
  },
  {
    title: "[Isu] Peran Strategis Aktivis Dakwah Kampus di Universitas Sebelas Maret",
    slug: "peran-strategis-dakwah-kampus",
    excerpt: "Opini mengenai kontribusi nyata yang dapat diberikan mahasiswa Muslim terhadap dinamika sosial-kemasyarakatan di kampus serta pentingnya dakwah yang santun dan inklusif.",
    publishedAt: new Date().toISOString(),
    category: "Isu" as const,
    author: "Kastrat JN UKMI",
  },
  {
    title: "[Kajian] Tafsir Al-Quran Aktual: Surah Al-Kahfi di Tengah Fitnah Akhir Zaman",
    slug: "tafsir-al-kahfi-akhir-zaman",
    excerpt: "Ulasan mendalam mengenai pelajaran berharga dari kisah-kisah Surah Al-Kahfi serta tips praktis membentengi diri dari pengaruh negatif moral di masa sekarang.",
    publishedAt: new Date().toISOString(),
    category: "Kajian" as const,
    author: "Kaderisasi",
  },
  {
    title: "[Kegiatan] Semarak Ramadhan Kampus: Tebar Takjil & Ifthar Jam'i",
    slug: "semarak-ramadhan-ifthar-jami",
    excerpt: "Dokumentasi kebersamaan pengurus JN UKMI dalam berbagi keberkahan Ramadhan dengan pembagian makanan berbuka puasa gratis bagi civitas akademika UNS.",
    publishedAt: new Date().toISOString(),
    category: "Kegiatan" as const,
    author: "Syiar",
  },
  {
    title: "[Isu] Menatap Masa Depan Dakwah Kampus Melalui Media Kreatif",
    slug: "masa-depan-dakwah-media-kreatif",
    excerpt: "Analisis peluang dan tantangan penyampaian pesan-pesan moral keislaman melalui infografis, video pendek, dan konten audio di kalangan mahasiswa saat ini.",
    publishedAt: new Date().toISOString(),
    category: "Isu" as const,
    author: "Media",
  },
  {
    title: "[Kajian] Pentingnya Menjaga Ukhuwah Islamiyah di Lingkungan Kampus",
    slug: "menjaga-ukhuwah-islamiyah-kampus",
    excerpt: "Pembahasan mendalam tentang esensi persaudaraan sesama Muslim serta langkah konkret meminimalkan gesekan pendapat di era informasi digital.",
    publishedAt: new Date().toISOString(),
    category: "Kajian" as const,
    author: "Internal",
  },
  {
    title: "[Kegiatan] Bakti Sosial Akbar JN UKMI di Desa Mitra Karanganyar",
    slug: "bakti-sosial-karanganyar",
    excerpt: "Catatan pengabdian masyarakat berupa pemeriksaan kesehatan gratis dan pembagian sembako yang diinisiasi oleh Bidang Eksternal JN UKMI.",
    publishedAt: new Date().toISOString(),
    category: "Kegiatan" as const,
    author: "Eksternal",
  }
];

async function getFilteredArticles(category?: Category, searchQuery?: string) {
  if (category && category !== "Kegiatan" && category !== "Kajian" && category !== "Isu" && category !== "Lainnya") {
    return [];
  }

  let articles: any[] = [];
  try {
    articles = await getArticles();
  } catch {}

  if (!articles || articles.length === 0) {
    articles = dummyArticles;
  }

  let result = category ? articles.filter((a) => a.category === category) : articles;

  if (searchQuery && searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        (a.author && a.author.toLowerCase().includes(q))
    );
  }

  return result;
}

export default async function ArtikelPage({ searchParams }: PageProps) {
  const { category, page, q } = await searchParams;
  const filteredArticles = await getFilteredArticles(category as Category, q);

  // Pagination Configuration
  const itemsPerPage = 6;
  const totalArticles = filteredArticles.length;
  const totalPages = Math.ceil(totalArticles / itemsPerPage) || 1;
  const currentPage = Math.max(1, Math.min(totalPages, Number(page) || 1));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  // Helper to generate page URL
  const getPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    params.set("page", String(pageNum));
    return `/artikel?${params.toString()}`;
  };

  // Helper to generate category URL
  const getCategoryUrl = (catName?: string) => {
    const params = new URLSearchParams();
    if (catName) params.set("category", catName);
    if (q) params.set("q", q);
    return `/artikel?${params.toString()}`;
  };

  return (
    <div className="bg-white pb-16">
      <PageHeader
        badge="Publikasi & Media"
        title="Artikel & Kajian"
        subtitle="Temukan kumpulan kajian islami, liputan kegiatan, dan analisis isu kontemporer terhangat dari JN UKMI."
      >
        <Link
          href="/artikel/tulis"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-forest-600 hover:bg-forest-800 text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
        >
          <Pencil className="w-3.5 h-3.5" />
          Tulis Artikel Baru
        </Link>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 pt-10">

        {/* Search Bar & Category Filter Toolbar */}
        <div className="max-w-2xl mx-auto mb-10 space-y-5">
          {/* Search Form */}
          <form method="GET" action="/artikel" className="relative w-full">
            {category && <input type="hidden" name="category" value={category} />}
            <div className="relative flex items-center">
              <input
                type="text"
                name="q"
                defaultValue={q || ""}
                placeholder="Cari artikel berdasarkan kata kunci atau judul..."
                className="w-full pl-11 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-full text-xs md:text-sm font-medium focus:outline-none focus:border-forest-600 focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 bg-forest-600 hover:bg-forest-800 text-white text-xs font-bold rounded-full transition-all cursor-pointer"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2.5">
            <Link
              href={getCategoryUrl()}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border ${
                !category
                  ? "bg-forest-600 text-white border-forest-600"
                  : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
              }`}
            >
              Semua
            </Link>
            <Link
              href={getCategoryUrl("Kegiatan")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border ${
                category === "Kegiatan"
                  ? "bg-forest-600 text-white border-forest-600"
                  : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
              }`}
            >
              Kegiatan
            </Link>
            <Link
              href={getCategoryUrl("Kajian")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border ${
                category === "Kajian"
                  ? "bg-forest-600 text-white border-forest-600"
                  : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
              }`}
            >
              Kajian
            </Link>
            <Link
              href={getCategoryUrl("Isu")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border ${
                category === "Isu"
                  ? "bg-forest-600 text-white border-forest-600"
                  : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
              }`}
            >
              Isu
            </Link>
          </div>
        </div>

        {/* Search Query Info Indicator */}
        {q && (
          <div className="text-center mb-6 text-xs text-gray-500">
            Menampilkan hasil pencarian untuk kata kunci: <span className="font-bold text-forest-600">"{q}"</span>
            <Link href="/artikel" className="ml-2 text-xs underline text-gray-400 hover:text-gray-600">
              Reset Pencarian
            </Link>
          </div>
        )}

        {/* Articles Content Grid */}
        {paginatedArticles.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 border border-gray-200/50 rounded-2xl max-w-xl mx-auto">
            <p className="text-gray-500 font-semibold text-sm">Tidak ditemukan artikel yang sesuai.</p>
          </div>
        ) : (
          <div className="space-y-12">
            <ArticleGrid articles={paginatedArticles} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8 border-t border-gray-100 mt-12">
                {/* Prev Button */}
                <Link
                  href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                    currentPage === 1
                      ? "opacity-40 cursor-not-allowed border-gray-100 text-gray-300 pointer-events-none"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer active:scale-95"
                  }`}
                  aria-disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Sebelumnya
                </Link>

                {/* Page Number Indicators */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <Link
                        key={pageNum}
                        href={getPageUrl(pageNum)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isActive
                            ? "bg-forest-600 text-white shadow-sm"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>

                {/* Next Button */}
                <Link
                  href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                    currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed border-gray-100 text-gray-300 pointer-events-none"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer active:scale-95"
                  }`}
                  aria-disabled={currentPage === totalPages}
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
