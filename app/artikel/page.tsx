import { buildPageMetadata } from "@/lib/page-metadata";
import { getArticles, type ArticleListItem } from "@/lib/sanity";
import { PageHero } from "@/components/layout/PageHero";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ArticleCacheHydrator } from "@/components/article/ArticleCacheHydrator";
import { Pencil } from "lucide-react";

export const metadata = buildPageMetadata({
  title: 'Artikel',
  description: 'Baca artikel islami, kajian, liputan kegiatan, dan konten syiar terbaru dari JN UKMI UNS. Tulis dan bagikan artikelmu di sini.',
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
          className="group/new-article relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-lime bg-transparent px-5 py-2.5 text-xs font-bold text-white shadow-md transition-colors duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/70"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-lime motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-0 group-hover/new-article:translate-x-0"
          />
          <span className="relative z-10 inline-flex items-center justify-center gap-2 transition-colors duration-300 motion-reduce:transition-none group-hover/new-article:text-forest-950">
            <Pencil className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover/new-article:-rotate-6 motion-safe:group-hover/new-article:scale-110 motion-reduce:transform-none motion-reduce:transition-none" />
            <span>Tulis Artikel Baru</span>
          </span>
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
