import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan — JN UKMI",
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Image
          src="/logo-jnukmi.png"
          alt="JN UKMI Logo"
          width={100}
          height={100}
          className="mx-auto mb-8 opacity-80"
        />
        <h1 className="text-6xl font-bold text-green-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">Halaman tidak ditemukan</p>
        <p className="text-gray-500 mb-8">
          Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
        </p>
        <Link
          href="/"
          className="inline-block bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
