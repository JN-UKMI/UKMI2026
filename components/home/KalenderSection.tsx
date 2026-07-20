import { loadEvents } from "@/lib/content";
import { KalenderInteractive } from "./KalenderInteractive";

export async function KalenderSection() {
  const { events } = await loadEvents();

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-forest-900">Kalender UKMI</h2>
          <p className="text-gray-500 text-sm mt-1">Jadwal kegiatan dan acara JN UKMI</p>
        </div>

        <KalenderInteractive events={events} />
      </div>
    </section>
  );
}

