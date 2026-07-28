import { PageHero } from "@/components/layout/PageHero";
import { FadeIn } from "@/components/ui/motion";
import { TentangTabs } from "@/components/tentang/TentangTabs";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: "Tentang Kami",
  description:
    "Visi, misi, tujuan, dan sejarah perjalanan dakwah Jamaah Nurul Hada UKMI UNS \u2014 organisasi kemahasiswaan Islam yang konsisten membina generasi Qur'ani.",
  path: "/tentang",
  tags: ["tentang JN UKMI", "visi misi", "sejarah", "nilai luhur"],
});

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <PageHero
        badge="Jamaah Nurul Huda UNS"
        title="Tentang Kami"
        subtitle="Visi, Misi, Tujuan, dan Sejarah Perjalanan Dakwah JN UKMI"
      />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Top Header Title & Subtitle (Centered Layout) */}
        <FadeIn direction="up" className="mb-12 max-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              JN UKMI{" "}
              <span className="text-forest-600 relative inline-block">
                Universitas Sebelas Maret
                <span className="absolute bottom-1 left-0 w-full h-[4px] bg-lime/30 rounded-full" />
              </span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
              Mengenal lebih dalam profil, arah gerak, sejarah, dan nilai-nilai
              perjuangan unit kegiatan mahasiswa Islam tingkat universitas.
            </p>
          </div>
        </FadeIn>

        {/* Interactive Tabs Client Island */}
        <TentangTabs />
      </div>
    </div>
  );
}
