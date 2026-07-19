import type { Metadata } from "next";
import aboutData from "@/content/about.json";

export const generateMetadata = (): Metadata => ({
  title: "Tentang Kami — JN UKMI",
  description: aboutData.visi,
});

export default function TentangPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-900 to-green-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Kami</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Mengenal lebih dekat JN UKMI
          </p>
        </div>
      </section>

      {/* Visi */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-green-900 mb-6">Visi</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          {aboutData.visi}
        </p>
      </section>

      {/* Misi */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-green-900 mb-6">Misi</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {aboutData.misi}
          </p>
        </div>
      </section>

      {/* Tujuan */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-green-900 mb-6">Tujuan</h2>
        <ol className="list-decimal list-inside space-y-3">
          {aboutData.tujuan.map((item, i) => (
            <li key={i} className="text-gray-700 text-lg leading-relaxed">
              {item}
            </li>
          ))}
        </ol>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-green-900 mb-10 text-center">
            Perjalanan Kami
          </h2>
          <div className="relative border-l-4 border-green-700 ml-4 md:ml-0">
            {aboutData.timeline.map((item, i) => (
              <div key={i} className="mb-10 ml-8 relative">
                <span className="absolute -left-[2.45rem] top-1 w-5 h-5 bg-green-700 rounded-full border-4 border-white" />
                <span className="text-green-700 font-bold text-lg block">
                  {item.year}
                </span>
                <p className="text-gray-700 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
