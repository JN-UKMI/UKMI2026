// Twitter validates by URL convention — they fetch /twitter-image if
// twitter:card is "summary_large_image". We re-export the OG image so the
// dynamic brand banner appears in both card types without an extra render.
// `runtime` must be declared directly — Next.js 16+ disallows re-exporting
// route segment config properties.

export const runtime = "nodejs";
export { default, alt, size, contentType } from "./opengraph-image";
