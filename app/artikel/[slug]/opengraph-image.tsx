import { ImageResponse } from "next/og";
import { getArticleBySlug, urlFor } from "@/lib/sanity";
import type { SanityImageSource } from "@sanity/image-url";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Artikel JN UKMI UNS";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ArticleOgImage({ params }: Props) {
  const { slug } = await params;

  let title = "Artikel JN UKMI UNS";
  let category = "Artikel";
  let coverUrl: string | null = null;

  try {
    const article = await getArticleBySlug(slug);
    if (article?.title) {
      title = article.title;
      category = article.category || "Artikel";
      const cover = article.coverImage as
        | { asset?: { _ref?: string } }
        | string
        | null
        | undefined;
      if (cover && typeof cover === "object" && cover.asset) {
        coverUrl = urlFor(cover as SanityImageSource).width(600).url();
      } else if (typeof cover === "string") {
        coverUrl = cover;
      }
    }
  } catch {
    // Sanity tidak tersedia — pakai judul default.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0B3D2E 0%, #14532D 55%, #1B6B3C 100%)",
          color: "white",
          padding: 64,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "rgba(142,205,4,0.25)",
            filter: "blur(60px)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: -60,
            width: 380,
            height: 380,
            borderRadius: 9999,
            background: "rgba(142,205,4,0.15)",
            filter: "blur(70px)",
            display: "flex",
          }}
        />

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              background: "#8ECD04",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1.5, color: "#8ECD04" }}>
            JN UKMI UNS
          </div>
        </div>

        {/* Content: judul (kiri) + cover image (kanan, bila ada) */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 48,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                fontSize: 24,
                fontWeight: 700,
                color: "#8ECD04",
                border: "2px solid #8ECD04",
                borderRadius: 9999,
                padding: "8px 20px",
                marginBottom: 24,
              }}
            >
              {category}
            </div>
            <div
              style={{
                fontSize: 50,
                fontWeight: 900,
                lineHeight: 1.15,
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {title}
            </div>
          </div>
          {coverUrl && (
             
            <img
              src={coverUrl}
              alt=""
              width={260}
              height={260}
              style={{ borderRadius: 24, objectFit: "cover", border: "4px solid rgba(142,205,4,0.5)" }}
            />
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
          <span>●</span>
          <span>Jamaah Nurul Huda · UKMI Universitas Sebelas Maret</span>
        </div>
      </div>
    ),
    size
  );
}
