import type { Metadata } from "next";
import { Geist, Geist_Mono, Amiri } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { MusicPlayer } from "@/components/ui/MusicPlayer";
import { MusicProvider } from "@/components/ui/MusicContext";
import { LoadingProvider } from "@/components/ui/LoadingProvider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
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

export const metadata: Metadata = {
  title: "JN UKMI | Jamaah Nurul Huda Unit Kegiatan Mahasiswa Islam",
  description:
    "Website resmi Jamaah Nurul Huda UKMI Universitas Sebelas Maret. Organisasi kemahasiswaan Islam yang berkomitmen membina generasi qurani.",
  openGraph: {
    title: "JN UKMI | Jamaah Nurul Huda Unit Kegiatan Mahasiswa Islam",
    description:
      "Website resmi Jamaah Nurul Huda UKMI Universitas Sebelas Maret. Organisasi kemahasiswaan Islam yang berkomitmen membina generasi qurani.",
    type: "website",
    locale: "id_ID",
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Jamaah Nurul Huda UKMI",
              alternateName: "JN UKMI",
              url: "https://jnukmi.org",
              description:
                "Unit Kegiatan Mahasiswa Islam Universitas Sebelas Maret",
              memberOf: {
                "@type": "EducationalOrganization",
                name: "Universitas Sebelas Maret",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
          <LoadingProvider>
            <MusicProvider>
              <Navbar />
              <main id="main-content" tabIndex={-1} className="flex-1 outline-none">{children}</main>
              <Footer />
              <MusicPlayer />
              <BackToTop />
            </MusicProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
