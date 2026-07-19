import type { Metadata } from "next";

export const generateMetadata = (): Metadata => ({
  title: "Artikel | JN UKMI",
  description: "Kumpulan artikel dan tulisan dari Jamaah Nurul Huda UKMI.",
});

export default function ArtikelPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-green-900 to-green-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Artikel</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Kumpulan artikel dan tulisan inspiratif dari JN UKMI
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 px-4 border-b border-gray-100">
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari artikel..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-shadow"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Empty State */}
      <section className="py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <svg
            className="w-16 h-16 mx-auto mb-6 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Belum Ada Artikel
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Belum ada artikel yang diterbitkan. Silakan kembali lagi nanti
            untuk membaca tulisan terbaru dari JN UKMI.
          </p>
        </div>
      </section>
    </div>
  );
}
