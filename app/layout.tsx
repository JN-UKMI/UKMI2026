import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Amiri, Amiri_Quran, Noto_Naskh_Arabic } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { MusicPlayer } from "@/components/ui/MusicPlayer";
import { MusicProvider } from "@/components/ui/MusicContext";
import { LoadingProvider } from "@/components/ui/LoadingProvider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AmbientBackground } from "@/components/ui/motion";
import { BASE_URL, siteConfig } from "@/lib/seo";
import { buildSiteJsonLd } from "@/lib/json-ld";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
});

const amiriQuran = Amiri_Quran({
  weight: "400",
  subsets: ["arabic"],
  variable: "--font-amiri-quran",
});

const notoNaskh = Noto_Naskh_Arabic({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-noto-naskh",
});

/**
 * Root metadata — applied to every page unless overridden by a more specific
 * `metadata` export or a `generateMetadata` function. The `title.template`
 * means individual page titles like "Artikel Islami" become
 * "Artikel Islami | JN UKMI" automatically.
 */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${siteConfig.name} | ${siteConfig.shortName}`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  generator: "Next.js",
  keywords: [
    "UKMI",
    "JN UKMI",
    "Jamaah Nurul Huda",
    "Universitas Sebelas Maret",
    "UNS",
    "kemahasiswaan Islam",
    "dakwah kampus",
    "kajian Islam",
    "Surakarta",
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
      default: `${siteConfig.name} | ${siteConfig.shortName}`,
      template: `%s | ${siteConfig.shortName}`,
    },
    description: siteConfig.description,
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Organisasi Kemahasiswaan Islam UNS`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: `${siteConfig.name} | ${siteConfig.shortName}`,
      template: `%s | ${siteConfig.shortName}`,
    },
    description: siteConfig.description,
    images: ["/thumbnail.png"],
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
  manifest: "/favicon_io/site.webmanifest",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  verification: siteConfig.googleVerification
    ? { google: siteConfig.googleVerification }
    : undefined,
};

/**
 * Viewport is a separate export in Next 16 — `themeColor` was moved out of
 * `metadata` so it can adapt per scheme.
 */
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
      className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${amiriQuran.variable} ${notoNaskh.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
        <link rel="canonical" href={BASE_URL} />
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
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
        <AuthProvider>
          <ThemeProvider>
            <LoadingProvider>
              <MusicProvider>
                <AmbientBackground />
                <Navbar />
                <main id="main-content" tabIndex={-1} className="flex-1 outline-none relative z-10">{children}</main>
                <Footer />
                <MusicPlayer />
                <BackToTop />
              </MusicProvider>
            </LoadingProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
