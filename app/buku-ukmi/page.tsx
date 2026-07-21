import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Buku UKMI | JN UKMI",
  description: "Kumpulan buku, literatur, dan bahan kajian islami JN UKMI",
};

export default function BukuUkmiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        badge="Perpustakaan Digital"
        title="Buku UKMI"
        subtitle="Fitur perpustakaan digital dan katalog buku islami sedang dalam proses penyusunan."
        icon={<BookOpen className="w-8 h-8" />}
      />

      <div className="max-w-lg mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
            Nantikan kumpulan e-book, modul mentoring, dan publikasi literatur dakwah eksklusif dari JN UKMI di halaman ini.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-forest-600 hover:bg-forest-800 text-white rounded-full transition-all text-xs font-bold shadow-md cursor-pointer active:scale-95"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
