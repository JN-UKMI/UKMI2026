import { loadEvents } from "@/lib/content";
import { CalendarDays, MapPin, Clock } from "lucide-react";

export async function KalenderSection() {
  const { events } = await loadEvents();

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-forest-900">Kalender UKMI</h2>
          <p className="text-gray-500 text-sm mt-1">Jadwal kegiatan dan acara JN UKMI</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Belum ada acara terjadwal.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {events.map((event, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow p-6 flex gap-4"
              >
                {/* Date Badge */}
                <div className="shrink-0 w-14 h-14 rounded-lg bg-forest-400/10 text-forest-600 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold uppercase leading-none">
                    {new Date(event.date).toLocaleDateString("id-ID", { month: "short" })}
                  </span>
                  <span className="text-xl font-bold leading-none mt-0.5">
                    {new Date(event.date).getDate()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 bg-forest-400/10 text-forest-600 text-xs font-medium rounded-full mb-2">
                    {event.type}
                  </span>
                  <h3 className="font-semibold text-gray-900 mb-1.5">{event.title}</h3>
                  <div className="flex flex-col gap-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
