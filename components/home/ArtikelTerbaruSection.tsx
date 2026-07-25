import { ArticleCard } from "@/components/article/ArticleCard";
import { getArticles } from "@/lib/sanity";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { TransitionLink } from "@/components/ui/TransitionLink";

const dummyArticles = [
  {
    title: "[Kajian] Meneladani Karakter Pemuda Shalih di Era Modern",
    slug: "meneladani-karakter-pemuda-shalih",
    excerpt: "Rangkuman kajian pekanan mengenai pilar-pilar karakter yang harus dimiliki pemuda Muslim untuk menghadapi tantangan zaman agar tetap istiqomah di tengah arus modernisasi global.",
    publishedAt: new Date().toISOString(),
    category: "Kajian",
    author: "Humas JN UKMI",
  },
  {
    title: "[Kegiatan] Dokumentasi Rapat Kerja Kabinet Iskandar Muda",
    slug: "dokumentasi-raker-iskandar-muda",
    excerpt: "Laporan pelaksanaan rapat kerja kepengurusan JN UKMI untuk merumuskan program dakwah strategis selama satu periode ke depan, menyelaraskan visi misi bersama seluruh pengurus.",
    publishedAt: new Date().toISOString(),
    category: "Kegiatan",
    author: "Sekretariat",
  },
  {
    title: "[Isu] Peran Strategis Aktivis Dakwah Kampus di Universitas Sebelas Maret",
    slug: "peran-strategis-dakwah-kampus",
    excerpt: "Opini mengenai kontribusi nyata yang dapat diberikan mahasiswa Muslim terhadap dinamika sosial-kemasyarakatan di kampus serta pentingnya dakwah yang santun dan inklusif.",
    publishedAt: new Date().toISOString(),
    category: "Isu",
    author: "Kastrat JN UKMI",
  },
];

export async function ArtikelTerbaruSection() {
  let articles: { title: string; slug: string; excerpt: string; publishedAt: string; category: string; author?: string; coverImage?: any }[] = [];
  try {
    articles = await getArticles();
  } catch {}

  if (articles.length === 0) {
    articles = dummyArticles;
  }

  return (
    <section className="relative overflow-hidden py-20 px-4 bg-transparent transition-colors duration-300">
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeader
          icon={<Newspaper className="w-6 h-6 text-forest-600 dark:text-lime" />}
          title="Artikel Terbaru"
          subtitle="Kajian, kegiatan, dan berita terbaru dari JN UKMI"
        />

        {articles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border border-gray-200/50 rounded-2xl">
            <Calendar className="w-10 h-10 text-gray-350 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold text-sm">Belum ada artikel. Pantau terus untuk update terbaru.</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-none md:grid md:grid-cols-2 md:overflow-x-visible md:pb-0 md:mx-0 md:px-0 lg:grid-cols-3 md:gap-6">
            {articles.slice(0, 3).map((article) => (
              <div
                key={article.slug}
                className="shrink-0 w-[85vw] max-w-[340px] snap-center md:w-auto md:max-w-none md:shrink"
              >
                <ArticleCard article={article as any} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <TransitionLink
            href="/artikel"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-forest-50 hover:bg-forest-100 text-forest-700 border border-forest-200 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
          >
            Lihat Semua Artikel <ArrowRight className="w-4 h-4" />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
