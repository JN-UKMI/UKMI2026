import sanitizeHtml from "sanitize-html";

export function sanitizeArticleContent(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [
      "p", "br", "strong", "em", "b", "i", "u", "a", "ul", "ol", "li",
      "blockquote", "code", "pre", "h1", "h2", "h3", "h4", "img",
      "figure", "figcaption", "span", "div", "hr",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      span: ["class"],
      div: ["class"],
      code: ["class"],
      pre: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
    disallowedTagsMode: "discard",
  });
}
