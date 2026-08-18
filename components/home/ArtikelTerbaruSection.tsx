"use client";

import { ArticleCard } from "@/components/article/ArticleCard";
import { ArticleHeroCard } from "@/components/article/ArticleHeroCard";
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
    <section className="relative overflow-hidden py-10 sm:py-14 px-4 bg-transparent transition-colors duration-300">
      <div className="relative z-10 max-w-6xl mx-auto">
        <FadeIn>
          <SectionHeader
            icon={<Newspaper className="w-6 h-6 text-forest-600 dark:text-lime" />}
            title="Artikel Terbaru"
            subtitle="Kajian, kegiatan, dan berita terbaru dari JN UKMI"
          />
        </FadeIn>

        {displayedArticles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 rounded-2xl">
            <Calendar className="w-10 h-10 text-gray-350 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">Belum ada artikel. Pantau terus untuk update terbaru.</p>
          </div>
        ) : (
          <>
            {/* Mobile - semua card memakai style hero (gambar kiri, teks kanan) */}
            <div className="md:hidden space-y-3">
              {displayedArticles.slice(0, 3).map((article) => (
                <ArticleHeroCard key={article.slug} article={article} />
              ))}
            </div>

            {/* md+ - grid 2/3 kolom dengan stagger scroll animation */}
            <StaggerContainer className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 items-stretch">
              {displayedArticles.slice(0, 3).map((article) => (
                <StaggerItem key={article.slug} className="flex h-full flex-col">
                  <ArticleCard article={article} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </>
        )}

        <div className="mt-10 text-center">
          <TransitionLink
            href="/artikel"
            className="group/all-articles relative isolate inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full border border-forest-600 dark:border-lime bg-transparent px-6 py-2.5 text-xs font-bold text-forest-700 dark:text-lime shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:border-lime dark:hover:border-lime hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-forest-600 dark:bg-lime motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-0 group-hover/all-articles:translate-x-0"
            />
            <span className="relative z-10 inline-flex items-center gap-1.5 transition-colors duration-300 motion-reduce:transition-none group-hover/all-articles:text-white dark:group-hover/all-articles:text-forest-950">
              <span>Lihat Semua Artikel</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover/all-articles:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
            </span>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
