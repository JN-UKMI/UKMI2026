"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, CalendarDays } from "lucide-react";
import type { EventItem } from "@/lib/types";

interface KalenderInteractiveProps {
  events: EventItem[];
}

const INDONESIAN_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAYS_OF_WEEK = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export function KalenderInteractive({ events }: KalenderInteractiveProps) {
  // Tentukan tanggal awal berdasar event pertama jika ada, atau tanggal hari ini
  const initialDate = events.length > 0 ? new Date(events[0].date) : new Date();
  
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Dapatkan hari pertama di bulan ini (0 = Minggu, 1 = Senin, dst.)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Sesuaikan agar hari Senin berada di awal indeks (0 = Senin, 6 = Minggu)
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // Dapatkan jumlah hari di bulan ini
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Dapatkan jumlah hari di bulan sebelumnya (untuk padding)
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  // Navigasi bulan
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDateStr(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDateStr(null);
  };

  // Helper untuk mengecek apakah ada kegiatan di tanggal tertentu
  const getEventsForDate = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateString);
  };

  // List seluruh event di bulan aktif
  const activeMonthEvents = events.filter((event) => {
    const eDate = new Date(event.date);
    return eDate.getFullYear() === year && eDate.getMonth() === month;
  });

  // Event yang terpilih untuk ditampilkan di sisi kanan
  const displayedEvents = selectedDateStr
    ? events.filter((e) => e.date === selectedDateStr)
    : activeMonthEvents;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
      {/* KIRI: Kalender Grid */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-extrabold text-gray-800 text-base md:text-lg">
            {INDONESIAN_MONTHS[month]} {year}
          </h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer active:scale-95"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer active:scale-95"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4 md:w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] md:text-xs text-gray-400 mb-2 uppercase tracking-wider">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Days from previous month */}
          {Array.from({ length: startOffset }).map((_, i) => {
            const dayNum = prevMonthTotalDays - startOffset + i + 1;
            return (
              <div
                key={`prev-${i}`}
                className="aspect-square flex items-center justify-center text-xs text-gray-300 pointer-events-none bg-gray-55 rounded-xl min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px]"
              >
                {dayNum}
              </div>
            );
          })}

          {/* Days of current month */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
            const dayEvents = getEventsForDate(dayNum);
            const hasEvents = dayEvents.length > 0;
            const isSelected = selectedDateStr === dateString;

            return (
              <button
                key={`curr-${dayNum}`}
                onClick={() => setSelectedDateStr(isSelected ? null : dateString)}
                className={`relative aspect-square flex flex-col items-center justify-center text-xs md:text-sm font-bold rounded-xl transition-all border cursor-pointer active:scale-95 min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] ${
                  isSelected
                    ? "bg-forest-600 text-white border-forest-600 shadow-sm"
                    : hasEvents
                    ? "bg-forest-50 text-forest-800 border-forest-100 hover:bg-forest-100/50"
                    : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50"
                }`}
              >
                <span>{dayNum}</span>
                {/* Event indicator badge */}
                {hasEvents && (
                  <span
                    className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-white" : "bg-lime"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* KANAN (Akan berada di bawah untuk mobile): Detail Kegiatan */}
      <div className="lg:col-span-5 flex flex-col h-full w-full">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6 flex flex-col flex-1 min-h-[300px]">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <h3 className="font-extrabold text-gray-800 text-base md:text-lg">
              {selectedDateStr ? "Detail Kegiatan" : "Kegiatan Bulan Ini"}
            </h3>
            {selectedDateStr && (
              <button
                onClick={() => setSelectedDateStr(null)}
                className="text-xs font-bold text-forest-600 hover:text-forest-850 transition-colors cursor-pointer"
              >
                Lihat Semua
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 max-h-[350px] pr-1">
            {displayedEvents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <CalendarDays className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-gray-500 text-xs font-semibold">
                  {selectedDateStr
                    ? "Tidak ada kegiatan yang terjadwal pada tanggal ini."
                    : "Tidak ada kegiatan terjadwal di bulan ini."}
                </p>
              </div>
            ) : (
              displayedEvents.map((event, index) => (
                <div
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100/50 transition-colors rounded-xl p-4 border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-block px-2.5 py-0.5 bg-forest-400/10 text-forest-700 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                      {event.type}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 font-mono">
                      {new Date(event.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-3">{event.title}</h4>
                  
                  <div className="flex flex-col gap-2 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-forest-600 shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-forest-600 shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
