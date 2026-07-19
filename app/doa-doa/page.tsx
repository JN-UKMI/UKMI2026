import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Database Doa | JN UKMI",
  description: "Kumpulan doa sehari-hari untuk diamalkan",
};

export default function DoaDoaPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-6">🕌</div>
        <h1 className="text-3xl font-bold text-forest-900 mb-4">
          Database Doa
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Fitur ini sedang dalam pengembangan
        </p>
        <div className="w-16 h-1 bg-forest-600 mx-auto rounded-full mb-8" />
        <p className="text-sm text-gray-400">
          Kumpulan doa-doa dari Al-Quran dan Hadist akan tersedia di sini.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-6 py-2.5 bg-forest-600 text-white rounded-lg hover:bg-forest-800 transition text-sm font-medium"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
