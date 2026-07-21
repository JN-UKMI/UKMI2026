import { loadEvents } from "@/lib/content";
import { KalenderInteractive } from "./KalenderInteractive";
import { Calendar } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";

export async function KalenderSection() {
  const { events } = await loadEvents();

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          icon={<Calendar className="w-6 h-6" />}
          title="Kalender UKMI"
          subtitle="Jadwal kegiatan dan agenda acara JN UKMI"
        />

        <KalenderInteractive events={events} />
      </div>
    </section>
  );
}
