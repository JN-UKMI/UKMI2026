import { buildPageMetadata } from "@/lib/page-metadata";
import { getArticles, type ArticleListItem } from "@/lib/sanity";
import { PageHero } from "@/components/layout/PageHero";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ArticleCacheHydrator } from "@/components/article/ArticleCacheHydrator";
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

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string; q?: string }>;
}

export default async function ArtikelPage({ searchParams }: PageProps) {
  const { category, page, q } = await searchParams;

  let articles: ArticleListItem[] = [];
  let fresh = false;
  try {
    articles = await getArticles();
    fresh = articles.length > 0;
  } catch {
    articles = [];
  }
  // When Sanity returns empty or throws, leave articles as [] so the
  // ArticleCacheHydrator client can resolve via localStorage cache →
  // fallback Articles chain. This way a hard refresh during a Sanity
  // outage shows the user their previously-cached real articles, not
  // the made-up dummy list.

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
        <ArticleCacheHydrator
          serverArticles={articles}
          fallbackArticles={[]}
          fresh={fresh}
          initialCategory={category}
          initialQuery={q}
          initialPage={page}
        />
      </div>
    </div>
  );
}
