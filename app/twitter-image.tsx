// Twitter validates by URL convention — they fetch /twitter-image if
// twitter:card is "summary_large_image". We re-export the OG image so the
// dynamic brand banner appears in both card types without an extra render.

export { default, alt, size, contentType, runtime } from "./opengraph-image";
