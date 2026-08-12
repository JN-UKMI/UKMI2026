import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { MusicPlayer } from "@/components/ui/MusicPlayer";
import { MusicProvider } from "@/components/ui/MusicContext";
import { LoadingProvider } from "@/components/ui/LoadingProvider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { AmbientBackground, GrainOverlay } from "@/components/ui/motion";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { BASE_URL, siteConfig } from "@/lib/seo";
import { buildSiteJsonLd } from "@/lib/json-ld";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ServiceWorkerRegister } from "@/components/ui/ServiceWorkerRegister";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

/**
 * Root metadata — applied to every page unless overridden by a more specific
 * `metadata` export or a `generateMetadata` function. The `title.template`
 * means individual page titles like "Artikel Islami" become
 * "Artikel Islami | JN UKMI" automatically.
 */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    // Brand-first default (used when a page ships no title): leads with the
    // short brand so "jnukmi" queries match the title tag directly.
    default: "JN UKMI UNS — Jamaah Nurul Huda Unit Kegiatan Mahasiswa Islam",
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  generator: "Next.js",
  keywords: [
    "JN UKMI",
    "JN UKMI UNS",
    "Rohis UNS",
    "Organisasi Islam UNS",
    "Nurul Huda UNS",
    "Remaja Masjid UNS",
    "UKMI UNS Solo",
    "UKM Islam UNS",
    "Lembaga Dakwah Kampus UNS",
    "LDK UNS Surakarta",
    "LDF Fakultas UNS",
    "Kajian Islam Mahasiswa Surakarta",
    "Kegiatan Islami Kampus UNS",
    "Jadwal Puasa Sunnah UNS",
    "Al-Kahfi Digital UNS",
    "Universitas Sebelas Maret Islam",
  ],
  authors: [{ name: siteConfig.name, url: BASE_URL }],
  creator: siteConfig.shortName,
  publisher: siteConfig.name,
  category: "Organisasi Kemahasiswaan Islam",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: BASE_URL,
    siteName: siteConfig.name,
    title: {
      // Brand-first default so "jnukmi" matches the OG title on social shares.
      // NOTE: every public page sets its og:title as { absolute } via
      // buildPageMetadata (to avoid the double-suffix bug), so this template
      // is a safety net for pages without an explicit og:title.
      default: "JN UKMI UNS — Jamaah Nurul Huda Unit Kegiatan Mahasiswa Islam",
      template: `%s | ${siteConfig.shortName}`,
    },
    description: siteConfig.description,
    images: [
      {
        // Absolute URL — some crawlers (WhatsApp/Telegram) ignore relative og:image
        url: `${BASE_URL}/thumbnail.png`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Organisasi Kemahasiswaan Islam UNS`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "JN UKMI UNS — Jamaah Nurul Huda Unit Kegiatan Mahasiswa Islam",
      template: `%s | ${siteConfig.shortName}`,
    },
    description: siteConfig.description,
    images: [`${BASE_URL}/thumbnail.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon_io/favicon.ico" },
    ],
    apple: [
      { url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon_io/favicon.ico"],
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  // PWA — manifest + iOS installability
  manifest: "/favicon_io/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.shortName,
  },
  verification: siteConfig.googleVerification
    ? { google: siteConfig.googleVerification }
    : undefined,
};

/**
 * Viewport is a separate export in Next 16 — `themeColor` was moved out of
 * `metadata` so it can adapt per scheme.
 */
// Geist Sans + Geist Mono (same fonts the site used before the font swap).
// `next/font/google` self-hosts the woff2 files at build time, so there is
// NO runtime request to Google — fonts ship from our own origin.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.themeColorLight },
    { media: "(prefers-color-scheme: dark)", color: siteConfig.themeColorDark },
  ],
  colorScheme: "light dark",
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the per-request nonce injected by proxy.ts so the inline
  // JSON-LD `<script>` matches the strict CSP we set per request.
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") ?? undefined;

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          nonce={nonce}
          // The nonce is generated per-request in middleware; React's
          // client-side tree has no access to it, so the attribute differs
          // between server HTML and hydration. JSON-LD is non-executable,
          // so suppressing the warning is safe here.
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: buildSiteJsonLd() }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative max-w-full overflow-x-clip">
        <AuthProvider>
          <ThemeProvider>
            <MotionProvider>
              <LoadingProvider>
              <MusicProvider>
                <AmbientBackground />
                {/* Grain halus global — dekoratif, pointer-events-none, z di bawah konten utama */}
                <GrainOverlay />
                <SmoothScroll>
                  <Navbar />
                  <main id="main-content" tabIndex={-1} className="flex-1 outline-none relative z-10 w-full max-w-full overflow-x-clip">{children}</main>
                  <Footer />
                </SmoothScroll>
                <MusicPlayer />
                <BackToTop />
                <ServiceWorkerRegister />
                <CommandPalette />
                <Analytics />
                <SpeedInsights />
              </MusicProvider>
              </LoadingProvider>
            </MotionProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
