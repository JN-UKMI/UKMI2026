import Link from "next/link";
import Image from "next/image";
import { getArticles } from "@/lib/sanity";
import { Calendar, ArrowRight, Pencil, Newspaper } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";

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
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          icon={<Newspaper className="w-6 h-6" />}
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
              <Link
                key={article.slug}
                href={`/artikel/${article.slug}`}
                className="group flex flex-col bg-white rounded-xl border border-gray-200 hover:border-forest-600 hover:shadow-md transition-all duration-300 overflow-hidden shrink-0 w-[85vw] max-w-[340px] snap-center md:w-auto md:max-w-none md:shrink"
              >
                {/* Thumbnail Image */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  <Image
                    src={article.coverImage ? article.coverImage : "/placeholder.png"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300"
                  />
                  {/* Category Badge on top of image */}
                  <span className="absolute top-3 left-3 z-10 inline-block px-2.5 py-1 bg-forest-600 text-white text-xs font-bold rounded-md shadow">
                    {article.category}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <h3 className="font-semibold text-gray-900 group-hover:text-forest-600 transition-colors mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-3 border-t border-gray-100 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-forest-600" />
                      {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Pencil className="w-3.5 h-3.5 text-forest-600" />
                      {article.author || "Anonim"}
                    </span>
                  </div>

                  <div className="w-full text-center py-2 px-4 rounded-full bg-forest-600 group-hover:bg-forest-750 text-white text-xs font-bold transition-colors mt-4">
                    Baca Selengkapnya
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-forest-50 hover:bg-forest-100 text-forest-700 border border-forest-200 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
          >
            Lihat Semua Artikel <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
