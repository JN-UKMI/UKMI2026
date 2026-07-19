import Image from "next/image";
import Link from "next/link";
import homeData from "@/content/home.json";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-green-900 to-green-700 text-white py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Image
            src="/logo-jnukmi.png"
            alt="JN UKMI Logo"
            width={120}
            height={120}
            className="mx-auto mb-6"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {homeData.tagline}
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
            {homeData.deskripsi}
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-green-900 mb-8">Kegiatan Terbaru</h2>
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-lg">Belum ada kegiatan.</p>
          <p className="text-sm mt-1">Kegiatan akan muncul di sini setelah ditambahkan.</p>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-green-900 mb-8">Artikel Terbaru</h2>
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl bg-white">
            <p className="text-lg">Belum ada artikel.</p>
            <p className="text-sm mt-1">Artikel akan muncul di sini setelah diterbitkan.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
