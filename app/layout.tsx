import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
