import { loadEvents } from "@/lib/content";
import { KalenderInteractive } from "./KalenderInteractive";
import { Calendar } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";

export async function KalenderSection() {
  const { events, monthly_quotes, hijri_months } = await loadEvents();

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          icon={<Calendar className="w-6 h-6" />}
          title="Kalender UKMI & Puasa Sunnah"
          subtitle="Jadwal kegiatan kepengurusan JN UKMI dan kalender puasa sunnah bulanan"
        />

        <KalenderInteractive
          events={events}
          monthlyQuotes={monthly_quotes}
          hijriMonths={hijri_months}
        />
      </div>
    </section>
  );
}
