import Image from "next/image";
import { buildPageMetadata } from "@/lib/page-metadata";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { SlideIn } from "@/components/ui/SlideIn";

export const metadata = buildPageMetadata({
  title: 'Halaman Tidak Ditemukan',
  description: '',
  path: '/404',
  noindex: true,
});

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <SlideIn direction="left" className="text-center max-w-md">
        <Image
          src="/image/logo-jnukmi.svg"
          alt="JN UKMI Logo"
          width={100}
          height={100}
          className="mx-auto mb-8 opacity-80"
        />
        <h1 className="text-6xl sm:text-7xl font-black text-forest-900 dark:text-lime mb-4 tracking-tight">404</h1>
        <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Halaman tidak ditemukan</p>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm sm:text-base">
          Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
        </p>
        <TransitionLink
          href="/"
          className="inline-block bg-forest-600 dark:bg-lime text-white dark:text-forest-950 font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Kembali ke Beranda
        </TransitionLink>
      </SlideIn>
    </div>
  );
}
