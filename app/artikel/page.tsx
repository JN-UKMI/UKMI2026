import { buildPageMetadata } from "@/lib/page-metadata";
import { getArticles, type ArticleListItem } from "@/lib/sanity";
import { PageHero } from "@/components/layout/PageHero";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ArticleList } from "@/components/article/ArticleList";
import { Pencil } from "lucide-react";

export const metadata = buildPageMetadata({
  title: 'Artikel',
  description: 'Baca artikel tentang kegiatan, kajian, dan isu-isu terbaru dari JN UKMI',
  path: '/artikel',
});

// 1 hour revalidate — articles rarely change between sessions, so caching the
// full list here keeps tab switches / pagination purely client-side without
// hitting Sanity on every navigation. Next.js Router Cache additionally keeps
// the rendered Server Component warm in the browser for back/forward nav.
export const revalidate = 3600;

// Local fallback used when Sanity is unreachable or has no published articles.
// Shape matches ArticleListItem (coverImage is optional so it's omitted).
const dummyArticles: ArticleListItem[] = [
  {
    title: "[Kajian Islami] Membangun Karakter Pemuda Muslim di Era Milenial",
    slug: "membangun-karakter-pemuda-muslim",
    excerpt:
      "Rangkuman kajian pekanan mengenai pilar-pilar karakter yang harus dimiliki pemuda Muslim untuk menghadapi tantangan zaman agar tetap istiqomah di tengah arus modernisasi global.",
    publishedAt: new Date().toISOString(),
    category: "Kajian Islami" as const,
    author: "Humas JN UKMI",
  },
  {
    title: "[Artikel Islami] Dokumentasi Rapat Kerja Kabinet Iskandar Muda",
    slug: "dokumentasi-raker-iskandar-muda",
    excerpt:
      "Laporan pelaksanaan rapat kerja kepengurusan JN UKMI untuk merumuskan program dakwah strategis selama satu periode ke depan, menyelaraskan visi misi bersama seluruh pengurus.",
    publishedAt: new Date().toISOString(),
    category: "Artikel Islami" as const,
    author: "Sekretariat",
  },
  {
    title: "[Lainnya] Peran Strategis Aktivis Dakwah Kampus di Universitas Sebelas Maret",
    slug: "peran-strategis-dakwah-kampus",
    excerpt:
      "Opini mengenai kontribusi nyata yang dapat diberikan mahasiswa Muslim terhadap dinamika sosial-kemasyarakatan di kampus serta pentingnya dakwah yang santun dan inklusif.",
    publishedAt: new Date().toISOString(),
    category: "Lainnya" as const,
    author: "Kastrat JN UKMI",
  },
  {
    title: "[Kajian Islami] Tafsir Al-Quran Aktual: Surah Al-Kahfi di Tengah Fitnah Akhir Zaman",
    slug: "tafsir-al-kahfi-akhir-zaman",
    excerpt:
      "Ulasan mendalam mengenai pelajaran berharga dari kisah-kisah Surah Al-Kahfi serta tips praktis membentengi diri dari pengaruh negatif moral di masa sekarang.",
    publishedAt: new Date().toISOString(),
    category: "Kajian Islami" as const,
    author: "Kaderisasi",
  },
  {
    title: "[Artikel Islami] Semarak Ramadhan Kampus: Tebar Takjil & Ifthar Jam'i",
    slug: "semarak-ramadhan-ifthar-jami",
    excerpt:
      "Dokumentasi kebersamaan pengurus JN UKMI dalam berbagi keberkahan Ramadhan dengan pembagian makanan berbuka puasa gratis bagi civitas akademika UNS.",
    publishedAt: new Date().toISOString(),
    category: "Artikel Islami" as const,
    author: "Syiar",
  },
  {
    title: "[Lainnya] Menatap Masa Depan Dakwah Kampus Melalui Media Kreatif",
    slug: "masa-depan-dakwah-media-kreatif",
    excerpt:
      "Analisis peluang dan tantangan penyampaian pesan-pesan moral keislaman melalui infografis, video pendek, dan konten audio di kalangan mahasiswa saat ini.",
    publishedAt: new Date().toISOString(),
    category: "Lainnya" as const,
    author: "Media",
  },
  {
    title: "[Kajian Islami] Pentingnya Menjaga Ukhuwah Islamiyah di Lingkungan Kampus",
    slug: "menjaga-ukhuwah-islamiyah-kampus",
    excerpt:
      "Pembahasan mendalam tentang esensi persaudaraan sesama Muslim serta langkah konkret meminimalkan gesekan pendapat di era informasi digital.",
    publishedAt: new Date().toISOString(),
    category: "Kajian Islami" as const,
    author: "Internal",
  },
  {
    title: "[Artikel Islami] Bakti Sosial Akbar JN UKMI di Desa Mitra Karanganyar",
    slug: "bakti-sosial-karanganyar",
    excerpt:
      "Catatan pengabdian masyarakat berupa pemeriksaan kesehatan gratis dan pembagian sembako yang diinisiasi oleh Bidang Eksternal JN UKMI.",
    publishedAt: new Date().toISOString(),
    category: "Artikel Islami" as const,
    author: "Eksternal",
  },
];

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string; q?: string }>;
}

export default async function ArtikelPage({ searchParams }: PageProps) {
  const { category, page, q } = await searchParams;

  let articles: ArticleListItem[] = [];
  try {
    articles = await getArticles();
  } catch {
    articles = [];
  }
  if (articles.length === 0) {
    articles = dummyArticles;
  }

  return (
    <div className="bg-transparent pb-16">
      <PageHero
        badge="Media & Syiar Islam"
        title="Artikel & Kajian"
        subtitle="Temukan kumpulan kajian islami, liputan kegiatan, dan analisis isu kontemporer terhangat dari JN UKMI."
      >
        <TransitionLink
          href="/artikel/tulis"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 dark:bg-lime dark:hover:bg-lime/90 text-white dark:text-forest-950 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 border border-white/20 dark:border-lime/30"
        >
          <Pencil className="w-3.5 h-3.5" />
          Tulis Artikel Baru
        </TransitionLink>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 pt-10">
        <ArticleList
          articles={articles}
          initialCategory={category}
          initialQuery={q}
          initialPage={page}
        />
      </div>
    </div>
  );
}
