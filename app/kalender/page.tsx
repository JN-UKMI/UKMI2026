import { buildPageMetadata } from "@/lib/page-metadata";
import { loadEvents } from "@/lib/content";
import { KalenderInteractive } from "@/components/home/KalenderInteractive";
import { PageHero } from "@/components/layout/PageHero";

export const metadata = buildPageMetadata({
  title: "Kalender UKMI",
  description:
    "Jadwal kegiatan kepengurusan JN UKMI dan puasa sunnah (Senin-Kamis, Ayyamul Bidh) lengkap dengan detail agenda per bidang.",
  path: "/kalender",
});

export default async function KalenderPage() {
  const { events, monthly_quotes, hijri_months } = await loadEvents();

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <PageHero
        badge="Layanan Islam"
        title="Kalender UKMI"
        subtitle="Jadwal kegiatan kepengurusan JN UKMI dan puasa sunnah"
      />

      <div className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-1 sm:px-2">
          <KalenderInteractive
            events={events}
            monthlyQuotes={monthly_quotes}
            hijriMonths={hijri_months}
          />
        </div>
      </div>
    </div>
  );
}