import Image from "next/image";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";

export interface ArticleBodyProps {
  content: string | PortableTextBlock[];
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: { asset?: { url?: string }; src?: string; alt?: string; caption?: string } }) => (
      <figure className="my-10">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm">
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
      <h2 className="mt-10 mb-4 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl md:text-2xl font-semibold text-gray-900 dark:text-white leading-snug">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="my-5 leading-relaxed text-gray-700 dark:text-gray-100 text-base md:text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-[3px] border-lime dark:border-lime bg-forest-50/30 dark:bg-forest-900/20 pl-5 py-3 my-6 italic text-gray-600 dark:text-gray-300 rounded-r-lg">
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
        className="article-body prose prose-lg dark:prose-invert max-w-none
          prose-headings:text-gray-950 dark:prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:font-extrabold prose-h1:mt-10 prose-h1:mb-6
          prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl md:prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
          prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-2
          prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-100 prose-p:my-5
          prose-blockquote:border-l-[3px] prose-blockquote:border-lime dark:prose-blockquote:border-lime prose-blockquote:bg-forest-50/30 dark:prose-blockquote:bg-forest-900/20
          prose-blockquote:pl-5 prose-blockquote:py-3 prose-blockquote:my-6 prose-blockquote:italic
          prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300 prose-blockquote:font-normal prose-blockquote:rounded-r-lg
          prose-ul:list-disc prose-ul:pl-6 prose-ul:my-5
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-5
          prose-li:text-gray-700 dark:prose-li:text-gray-100 prose-li:my-1.5
          prose-a:text-forest-600 dark:prose-a:text-forest-300 prose-a:underline hover:prose-a:text-forest-800 dark:hover:prose-a:text-forest-200 prose-a:font-medium prose-a:decoration-forest-400 prose-a:underline-offset-2
          prose-strong:text-gray-950 dark:prose-strong:text-white prose-strong:font-bold
          prose-code:text-forest-700 dark:prose-code:text-forest-300 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-medium
          prose-pre:bg-[#1F2937] dark:prose-pre:bg-[#0F172A] prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-5 prose-pre:my-6 prose-pre:shadow-sm
          prose-pre:overflow-x-auto
          prose-img:rounded-xl prose-img:shadow-sm prose-img:my-8 prose-img:mx-auto
          prose-hr:border-gray-200 dark:prose-hr:border-gray-700 prose-hr:my-10
          prose-figure:my-8
          [style]:!text-inherit [style]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return <PortableText value={content} components={components} />;
}
