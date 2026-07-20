import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Buku UKMI | JN UKMI",
  description: "Kumpulan buku, literatur, dan bahan kajian islami JN UKMI",
};

export default function BukuUkmiPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg flex flex-col items-center">
        <div className="w-16 h-16 bg-forest-600/10 text-forest-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-forest-900 mb-4 uppercase tracking-wider">
          Buku UKMI
        </h1>
        <p className="text-base text-gray-500 mb-8 leading-relaxed font-medium">
          Fitur perpustakaan digital dan katalog buku islami sedang dalam proses penyusunan.
        </p>
        <div className="w-16 h-[3px] bg-lime rounded-full mb-8" />
        <p className="text-xs text-gray-400 font-medium">
          Nantikan kumpulan e-book, modul mentoring, dan publikasi literatur dakwah eksklusif dari JN UKMI di halaman ini.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 px-6 py-2.5 bg-forest-600 hover:bg-forest-800 text-white rounded-full transition-all text-sm font-bold shadow-md cursor-pointer active:scale-95"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
