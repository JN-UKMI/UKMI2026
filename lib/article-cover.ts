import { urlFor } from "@/lib/sanity";

/**
 * Resolve URL cover image artikel dari berbagai format Sanity:
 * - objek asset (gambar ter-upload di Sanity) → urlFor
 * - objek { url | imageUrl } (mis. data lokal/legacy)
 * - string URL langsung
 * Fallback: "/placeholder.png"
 */
export function resolveArticleCoverUrl(coverImage: unknown): string {
  if (!coverImage) return "/placeholder.png";
  try {
    if (typeof coverImage === "object" && coverImage !== null) {
      const img = coverImage as {
        asset?: unknown;
        url?: unknown;
        imageUrl?: unknown;
      };
      if (img.asset) {
        return urlFor(coverImage).url() || "/placeholder.png";
      }
      if (typeof img.url === "string" && img.url.trim() !== "") {
        return img.url;
      }
      if (typeof img.imageUrl === "string" && img.imageUrl.trim() !== "") {
        return img.imageUrl;
      }
    }
    if (typeof coverImage === "string" && coverImage.trim() !== "") {
      return coverImage;
    }
  } catch {
    return "/placeholder.png";
  }
  return "/placeholder.png";
}
