import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = (): { slug: string }[] => {
  return [];
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ")} | JN UKMI`,
    description: "Baca artikel JN UKMI.",
  };
};

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-green-900 to-green-700 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-green-300 uppercase tracking-wider mb-2">
            Artikel
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight capitalize">
            {slug.replace(/-/g, " ")}
          </h1>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
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
            Artikel Belum Tersedia
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Artikel dengan judul &ldquo;{slug.replace(/-/g, " ")}&rdquo; belum
            tersedia. Silakan kembali lagi nanti.
          </p>
        </div>
      </section>
    </div>
  );
}
