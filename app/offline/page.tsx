import Link from "next/link";
import { WifiOff } from "lucide-react";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: "Offline",
  description: "Koneksi internet terputus - halaman ini ditampilkan saat offline.",
  path: "/offline",
});

export default function OfflinePage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-forest-50 dark:bg-forest-950/80 text-forest-700 dark:text-lime flex items-center justify-center shadow-inner">
          <WifiOff className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Kamu Sedang Offline
        </h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Koneksi internet terputus. Periksa kembali jaringanmu, lalu coba muat ulang
          halaman - konten yang pernah kamu buka mungkin masih bisa diakses secara offline.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl border-2 border-forest-600 dark:border-lime bg-transparent px-6 py-2.5 text-sm font-bold text-forest-700 dark:text-lime transition-colors duration-300 hover:bg-forest-600 hover:text-white dark:hover:bg-lime dark:hover:text-forest-950 cursor-pointer"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
