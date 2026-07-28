"use client";

import { ArticleCard } from "@/components/article/ArticleCard";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import type { ArticlesListResult } from "@/lib/sanity";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

// FIXED timestamps (bukan `new Date()`) untuk mencegah hydration mismatch:
// komponen ini adalah "use client", jadi module-level `new Date()` akan
// dieksekusi ulang di sisi client dengan timestamp berbeda, sehingga markup
// server vs client tidak cocok kalau fallback ini dipakai.
// `coverImage` adalah optional di ArticleListItem, jadi boleh di-omit.
const dummyArticles: ArticlesListResult = [
  {
    title: "[Kajian Islami] Meneladani Karakter Pemuda Shalih di Era Modern",
    slug: "meneladani-karakter-pemuda-shalih",
    excerpt: "Rangkuman kajian pekanan mengenai pilar-pilar karakter yang harus dimiliki pemuda Muslim untuk menghadapi tantangan zaman agar tetap istiqomah di tengah arus modernisasi global.",
    publishedAt: "2024-09-12T00:00:00.000Z",
    category: "Kajian Islami",
    author: "Humas JN UKMI",
  },
  {
    title: "[Artikel Islami] Dokumentasi Rapat Kerja Kabinet Iskandar Muda",
    slug: "dokumentasi-raker-iskandar-muda",
    excerpt: "Laporan pelaksanaan rapat kerja kepengurusan JN UKMI untuk merumuskan program dakwah strategis selama satu periode ke depan, menyelaraskan visi misi bersama seluruh pengurus.",
    publishedAt: "2024-10-05T00:00:00.000Z",
    category: "Artikel Islami",
    author: "Sekretariat",
  },
  {
    title: "[Lainnya] Peran Strategis Aktivis Dakwah Kampus di Universitas Sebelas Maret",
    slug: "peran-strategis-dakwah-kampus",
    excerpt: "Opini mengenai kontribusi nyata yang dapat diberikan mahasiswa Muslim terhadap dinamika sosial-kemasyarakatan di kampus serta pentingnya dakwah yang santun dan inklusif.",
    publishedAt: "2024-11-20T00:00:00.000Z",
    category: "Lainnya",
    author: "Kastrat JN UKMI",
  },
];

interface ArtikelTerbaruSectionProps {
  articles?: ArticlesListResult;
}

export function ArtikelTerbaruSection({ articles = [] }: ArtikelTerbaruSectionProps) {
  const displayedArticles = articles.length > 0 ? articles : dummyArticles;

  return (
    <section className="relative overflow-hidden py-20 px-4 bg-transparent transition-colors duration-300">
      <div className="relative z-10 max-w-6xl mx-auto">
        <FadeIn className="mb-8">
          <SectionHeader
            icon={<Newspaper className="w-6 h-6 text-forest-600 dark:text-lime" />}
            title="Artikel Terbaru"
            subtitle="Kajian, kegiatan, dan berita terbaru dari JN UKMI"
          />
        </FadeIn>

        {displayedArticles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border border-gray-200/50 rounded-2xl">
            <Calendar className="w-10 h-10 text-gray-350 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">Belum ada artikel. Pantau terus untuk update terbaru.</p>
          </div>
        ) : (
          <StaggerContainer className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-none md:grid md:grid-cols-2 md:overflow-x-visible md:pb-0 md:mx-0 md:px-0 lg:grid-cols-3 md:gap-6">
            {displayedArticles.slice(0, 3).map((article) => (
              <StaggerItem
                key={article.slug}
                className="shrink-0 w-[85vw] max-w-[340px] snap-center md:w-auto md:max-w-none md:shrink"
              >
                <ArticleCard article={article} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        <div className="mt-10 text-center">
          <TransitionLink
            href="/artikel"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-forest-50 hover:bg-forest-100 text-forest-700 border border-forest-200 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 hover:shadow-md hover:gap-2 group"
          >
            Lihat Semua Artikel <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
