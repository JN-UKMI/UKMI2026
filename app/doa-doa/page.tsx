import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Database Doa | JN UKMI",
  description: "Kumpulan doa sehari-hari untuk diamalkan",
};

export default function DoaDoaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        badge="Kumpulan Doa"
        title="Database Doa"
        subtitle="Kumpulan doa-doa pilihan dari Al-Qur'an dan Hadits shahih."
      />

      <div className="max-w-lg mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
            Fitur database doa interaktif ini sedang dalam tahap pengembangan akhir. Nantikan kumpulan doa harian, doa perlindungan, dan adab berdoa di halaman ini.
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
