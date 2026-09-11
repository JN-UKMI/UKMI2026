import { buildPageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/layout/PageHero";
import { QrGenerator } from "@/components/ui/QrGenerator";
import { SlideIn } from "@/components/ui/SlideIn";
import { QrCode } from "lucide-react";

export const metadata = buildPageMetadata({
  title: "QR Code Generator",
  description: "Buat QR code gratis untuk teks atau link: custom warna, ukuran, dan logo tengah. Cocok untuk presensi, pembayaran, dan media dakwah JN UKMI UNS.",
  path: "/qr-generator",
});

export default function QrGeneratorPage() {
  return (
    <div className="min-h-screen bg-transparent pb-10 sm:pb-14 transition-colors duration-300">
      <PageHero
        badge="Layanan"
        title="QR Code Generator"
        subtitle="Buat QR code sendiri dalam hitungan detik. Custom warna, ukuran, dan logo tengah — gratis tanpa login."
      />

      <main className="max-w-6xl mx-auto px-4 pt-12 flex flex-col gap-16">
        <SlideIn direction="left">
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime/10 dark:bg-forest-900/50 text-forest-600 dark:text-lime flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-forest-900 dark:text-lime">Generator QR Code</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Masukkan teks atau URL, atur sesuai kebutuhan, lalu unduh sebagai PNG.
                </p>
              </div>
            </div>
            <QrGenerator />
          </section>
        </SlideIn>
      </main>
    </div>
  );
}