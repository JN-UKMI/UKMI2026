import { PortableText, type PortableTextComponents } from "@portabletext/react";

export interface ArticleBodyProps {
  content: any;
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => (
      <figure className="my-8">
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={value.asset.url}
            alt={value.alt || ""}
            className="object-cover"
            loading="lazy"
          />
        </div>
        {value.caption && (
          <figcaption className="mt-2 text-sm text-gray-600">{value.caption}</figcaption>
        )}
      </figure>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-8 mb-4 text-2xl font-bold text-gray-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-900">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="my-4 leading-relaxed text-gray-700">{children}</p>
    ),
  },
};

export function ArticleBody({ content }: ArticleBodyProps) {
  if (!content || content.length === 0) {
    return null;
  }

  return <PortableText value={content} components={components} />;
}