import { loadEvents } from "@/lib/content";
import { KalenderInteractive } from "./KalenderInteractive";
import { Calendar } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";

export async function KalenderSection() {
  const { events, monthly_quotes, hijri_months } = await loadEvents();

  return (
    <section className="relative overflow-hidden py-10 sm:py-14 px-4 bg-transparent transition-colors duration-300">
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeader
          icon={<Calendar className="w-6 h-6" />}
          title="Kalender UKMI"
          subtitle="Jadwal kegiatan kepengurusan JN UKMI dan puasa sunnah"
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
