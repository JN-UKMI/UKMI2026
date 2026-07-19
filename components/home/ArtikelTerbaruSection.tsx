import Link from "next/link";
import { getArticles } from "@/lib/sanity";
import { Calendar, ArrowRight } from "lucide-react";

export async function ArtikelTerbaruSection() {
  let articles: { title: string; slug: string; excerpt: string; publishedAt: string; category: string }[] = [];
  try {
    articles = await getArticles();
  } catch {}

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-forest-900 via-forest-800 to-forest-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Artikel Terbaru</h2>
            <p className="text-white/60 text-sm mt-1">Kajian, kegiatan, dan berita terbaru JN UKMI</p>
          </div>
          <Link
            href="/artikel"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-lime hover:text-lime/80 transition-colors"
          >
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white/10 rounded-xl">
            <Calendar className="w-10 h-10 text-white/40 mx-auto mb-3" />
            <p className="text-white/60">Belum ada artikel. Pantau terus untuk update terbaru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article) => (
              <Link
                key={article.slug}
                href={`/artikel/${article.slug}`}
                className="group bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow p-6"
              >
                <span className="inline-block px-2.5 py-0.5 bg-forest-400/10 text-forest-600 text-xs font-medium rounded-full mb-3">
                  {article.category}
                </span>
                <h3 className="font-semibold text-gray-900 group-hover:text-forest-600 transition-colors mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
                <time className="text-xs text-gray-400">
                  {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </time>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-lime hover:text-lime/80 transition-colors"
          >
            Lihat Semua Artikel <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
