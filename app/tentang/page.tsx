import { PageHero } from "@/components/layout/PageHero";
import { FadeIn } from "@/components/ui/motion";
import { TentangTabs } from "@/components/tentang/TentangTabs";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: "Tentang Kami",
  description:
    "Profil, visi, misi, dan sejarah JN UKMI UNS sejak 1991 sebagai organisasi Islam resmi Universitas Sebelas Maret.",
  path: "/tentang",
  tags: ["JN UKMI", "sejarah JN UKMI", "organisasi Islam UNS", "Nurul Huda UNS"],
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
            <h2 className="section-title-hover whitespace-nowrap text-3xl md:text-5xl font-extrabold text-black dark:text-black tracking-tight leading-tight">
              JN UKMI UNS
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
