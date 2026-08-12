import Image from "next/image";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";

export interface ArticleBodyProps {
  content: string | PortableTextBlock[];
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: { asset?: { url?: string }; src?: string; alt?: string; caption?: string } }) => (
      <figure className="my-10">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-md ring-1 ring-black/5 dark:ring-white/10">
          <Image
            src={value.asset?.url || value.src || ""}
            alt={value.alt || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            loading="lazy"
          />
        </div>
        {value.caption && (
          <figcaption className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400 italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-12 mb-5 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-9 mb-3.5 text-xl md:text-2xl font-semibold text-gray-900 dark:text-white leading-snug">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="my-6 leading-[1.85] text-gray-700 dark:text-gray-200 text-[17px] md:text-lg tracking-[0.005em]">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="relative overflow-hidden rounded-2xl border-2 border-l-4 border-forest-600 dark:border-lime bg-gradient-to-br from-forest-50/90 via-forest-50/40 to-transparent dark:bg-none dark:bg-gray-800/70 px-6 py-5 my-9 italic text-gray-700 dark:text-gray-200 text-lg leading-relaxed shadow-sm">
        {/* Ikon kutipan dari CSS .article-body blockquote::before — konsisten
            dengan branch string (HTML) */}
        {children}
      </blockquote>
    ),
  },
};

export function ArticleBody({ content }: ArticleBodyProps) {
  if (!content || content.length === 0) {
    return null;
  }

  // If content is a plain HTML string (from NovelEditor)
  if (typeof content === "string") {
    return (
      <div
        className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:text-gray-950 dark:prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:font-extrabold prose-h1:mt-12 prose-h1:mb-6
          prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-5
          prose-h3:text-xl md:prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-9 prose-h3:mb-3.5
          prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-7 prose-h4:mb-2.5
          prose-p:text-[17px] md:prose-p:text-lg prose-p:leading-[1.85] prose-p:tracking-[0.005em] prose-p:text-gray-700 dark:prose-p:text-gray-200 prose-p:my-6 first:prose-p:mt-0
          prose-blockquote:relative prose-blockquote:overflow-hidden prose-blockquote:rounded-2xl
          prose-blockquote:border-2 prose-blockquote:border-l-4 prose-blockquote:border-forest-600 dark:prose-blockquote:border-lime
          prose-blockquote:bg-gradient-to-br prose-blockquote:from-forest-50/90 prose-blockquote:via-forest-50/40 prose-blockquote:to-transparent
          dark:prose-blockquote:bg-none dark:prose-blockquote:bg-gray-800/70
          prose-blockquote:px-6 prose-blockquote:py-5 prose-blockquote:my-9 prose-blockquote:italic
          prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-200 prose-blockquote:font-normal prose-blockquote:text-lg prose-blockquote:leading-relaxed prose-blockquote:shadow-sm
          prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
          prose-li:text-gray-700 dark:prose-li:text-gray-200 prose-li:my-2 prose-li:leading-relaxed
          prose-li:marker:text-forest-500 dark:prose-li:marker:text-lime
          prose-a:text-forest-600 dark:prose-a:text-forest-300 prose-a:font-medium prose-a:underline prose-a:underline-offset-4 prose-a:decoration-forest-400/50 dark:prose-a:decoration-forest-300/40 hover:prose-a:text-forest-800 dark:hover:prose-a:text-lime hover:prose-a:decoration-lime hover:prose-a:decoration-2
          prose-strong:text-gray-950 dark:prose-strong:text-white prose-strong:font-bold
          prose-code:text-forest-700 dark:prose-code:text-forest-300 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.85em] prose-code:font-medium
          prose-pre:bg-[#1F2937] dark:prose-pre:bg-[#0F172A] prose-pre:text-gray-100 prose-pre:rounded-2xl prose-pre:p-5 prose-pre:my-8 prose-pre:shadow-md prose-pre:overflow-x-auto
          prose-pre:leading-relaxed
          prose-img:rounded-2xl prose-img:shadow-md prose-img:my-9 prose-img:mx-auto prose-img:ring-1 prose-img:ring-black/5 dark:prose-img:ring-white/10
          prose-hr:border-0 prose-hr:my-12 prose-hr:bg-gradient-to-r prose-hr:from-transparent prose-hr:via-forest-600/40 prose-hr:to-transparent prose-hr:h-px
          prose-figure:my-9
          [style]:!text-inherit [style]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return <PortableText value={content} components={components} />;
}
