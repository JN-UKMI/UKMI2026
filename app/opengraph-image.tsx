import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const runtime = "nodejs";
export const alt = `${siteConfig.name} — Organisasi Kemahasiswaan Islam UNS`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamic Open Graph image (1200×630) used as the default share card.
 *
 * Renders the org's brand identity (forest-green background, lime accent,
 * monogram) so that any link pasted into a chat / search / social network
 * shows a recognisable card.
 *
 * We avoid loading custom fonts here because next/og renders the response
 * synchronously with a fixed timeout; pulling Google fonts mid-request
 * has been linked to flaky timeouts on production traffic. System fonts
 * render reliably across all environments.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #103125 0%, #0f3a2e 40%, #14463a 100%)",
          color: "#ffffff",
          padding: "72px",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          position: "relative",
        }}
      >
        {/* Top row: brand monogram + tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 2,
            color: "#bef264",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#bef264",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0a3a2a",
              fontSize: 36,
              fontWeight: 900,
            }}
          >
            JN
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 32, color: "#ffffff" }}>
              Jamaah Nurul Huda
            </span>
            <span
              style={{
                fontSize: 22,
                color: "#a3d9b1",
                letterSpacing: 4,
                marginTop: 6,
                textTransform: "uppercase",
              }}
            >
              UKMI · Universitas Sebelas Maret
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 90,
            gap: 24,
            flexGrow: 1,
          }}
        >
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: -0.5,
              maxWidth: 900,
            }}
          >
            Membina Generasi Qur'ani
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#cfe9d5",
              maxWidth: 880,
              lineHeight: 1.2,
            }}
          >
            Dakwah, kajian, dan pengabdian — website resmi organisasi
            kemahasiswaan Islam UNS.
          </div>
        </div>

        {/* Footer chip */}
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "14px 22px",
            borderRadius: 999,
            background: "rgba(190, 242, 100, 0.18)",
            color: "#bef264",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          jnukmi.com ·”Generated _contextually_
        </div>
      </div>
    ),
    { ...size },
  );
}
