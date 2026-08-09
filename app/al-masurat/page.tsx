import { buildPageMetadata } from "@/lib/page-metadata";
import { DoaTabs } from "@/components/islamic/DoaTabs";
import { PageHero } from "@/components/layout/PageHero";
export const metadata = buildPageMetadata({
  title: 'Al-Ma’tsurat',
  description: 'Baca dan dengarkan Al-Ma\u2019tsurat Sughra & Kubra: dzikir pagi dan petang sesuai sunnah lengkap dengan audio murottal dari JN UKMI UNS.',
  path: '/al-masurat',
});

export default function AlMasuratPage() {
  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <PageHero
        badge="Layanan Islam"
        title="Al-Ma'tsurat"
        subtitle="Dzikir pagi & petang sesuai sunnah (Sughra & Kubra)"
      />

      <DoaTabs />
    </div>
  );
}
