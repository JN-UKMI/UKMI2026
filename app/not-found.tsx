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
        <h1 className="text-6xl font-bold text-forest-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">Halaman tidak ditemukan</p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
        </p>
        <TransitionLink
          href="/"
          className="inline-block bg-forest-600 hover:bg-forest-800 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg shadow-forest-600/10"
        >
          Kembali ke Beranda
        </TransitionLink>
      </SlideIn>
    </div>
  );
}
