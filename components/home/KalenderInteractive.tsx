"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, CalendarDays, Moon, Sparkles, Filter, Quote, Sparkle } from "lucide-react";
import type { EventItem } from "@/lib/types";

interface KalenderInteractiveProps {
  events: EventItem[];
  monthlyQuotes?: Record<string, { text: string; source: string }>;
}

const INDONESIAN_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAYS_OF_WEEK = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export function KalenderInteractive({ events, monthlyQuotes }: KalenderInteractiveProps) {
  // Set initial date to April 2026 if available in events, otherwise current date
  const defaultDate = events.length > 0 ? new Date(events[0].date) : new Date();
  
  const [currentDate, setCurrentDate] = useState<Date>(defaultDate);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "kegiatan" | "puasa">("all");

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const yearMonthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  // First day index (0 = Sunday, 1 = Monday)
  const firstDayIndex = new Date(year, month, 1).getDay();
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // Days in month
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDateStr(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDateStr(null);
  };

  // Helper to check if a specific day is today
  const checkIsToday = (dayNum: number) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === dayNum
    );
  };

  // Filter events based on active category
  const filteredEvents = events.filter((e) => {
    if (activeCategory === "kegiatan") return e.type !== "Puasa Sunnah" && !e.isPuasa;
    if (activeCategory === "puasa") return e.type === "Puasa Sunnah" || e.isPuasa;
    return true;
  });

  const getEventsForDate = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filteredEvents.filter((e) => e.date === dateString);
  };

  // Monthly events list
  const activeMonthEvents = filteredEvents.filter((event) => {
    const eDate = new Date(event.date);
    return eDate.getFullYear() === year && eDate.getMonth() === month;
  });

  // Displayed events list in right pane
  const displayedEvents = selectedDateStr
    ? filteredEvents.filter((e) => e.date === selectedDateStr)
    : activeMonthEvents;

  const currentQuote = monthlyQuotes?.[yearMonthKey];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Category Filter Pills & Today Quick Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <Filter className="w-4 h-4 text-forest-600" />
          <span>Tampilkan Agenda:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDateStr(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-forest-600/10 text-forest-700 border border-forest-600/30 hover:bg-forest-600 hover:text-white"
            title="Lompat ke tanggal hari ini"
          >
            📍 Hari Ini
          </button>
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeCategory === "all"
                ? "bg-forest-900 text-white border-forest-900 shadow-sm"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            Semua ({events.length})
          </button>
          <button
            onClick={() => setActiveCategory("kegiatan")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeCategory === "kegiatan"
                ? "bg-forest-600 text-white border-forest-600 shadow-sm"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            Agenda UKMI
          </button>
          <button
            onClick={() => setActiveCategory("puasa")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeCategory === "puasa"
                ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            🌙 Puasa Sunnah
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        {/* KIRI: Kalender Grid */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-sm p-5 md:p-6 w-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-forest-600" />
                <h3 className="font-black text-forest-900 text-base md:text-xl uppercase tracking-wider">
                  {INDONESIAN_MONTHS[month]} {year}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-forest-50 hover:text-forest-700 transition-colors cursor-pointer active:scale-95"
                  aria-label="Bulan sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-forest-50 hover:text-forest-700 transition-colors cursor-pointer active:scale-95"
                  aria-label="Bulan berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Legend Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-gray-500 mb-4 pb-2 border-b border-gray-50">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-forest-600 ring-2 ring-forest-600/30" />
                Hari Ini
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-lime" />
                Agenda UKMI
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Puasa Sunnah
              </span>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-[11px] md:text-xs text-forest-800 mb-3 uppercase tracking-wider">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar days grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Previous month padding */}
              {Array.from({ length: startOffset }).map((_, i) => {
                const dayNum = prevMonthTotalDays - startOffset + i + 1;
                return (
                  <div
                    key={`prev-${i}`}
                    className="aspect-square flex items-center justify-center text-xs text-gray-300 pointer-events-none bg-gray-50/50 rounded-xl min-w-[36px] min-h-[36px]"
                  >
                    {dayNum}
                  </div>
                );
              })}

              {/* Current month days */}
              {Array.from({ length: totalDays }).map((_, i) => {
                const dayNum = i + 1;
                const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const dayEvents = getEventsForDate(dayNum);
                const hasEvents = dayEvents.length > 0;
                const hasPuasa = dayEvents.some((e) => e.type === "Puasa Sunnah" || e.isPuasa);
                const isSelected = selectedDateStr === dateString;
                const isToday = checkIsToday(dayNum);

                return (
                  <button
                    key={`curr-${dayNum}`}
                    onClick={() => setSelectedDateStr(isSelected ? null : dateString)}
                    className={`relative aspect-square flex flex-col items-center justify-center text-xs md:text-sm font-bold rounded-xl transition-all border cursor-pointer active:scale-95 min-w-[36px] min-h-[36px] ${
                      isSelected
                        ? "bg-forest-900 text-white border-forest-900 shadow-md ring-2 ring-forest-600/30"
                        : isToday
                        ? "bg-forest-600 text-white border-forest-600 font-black shadow-md ring-2 ring-lime ring-offset-1"
                        : hasPuasa && hasEvents
                        ? "bg-emerald-50 text-emerald-900 border-emerald-300 font-extrabold hover:bg-emerald-100"
                        : hasEvents
                        ? "bg-forest-50 text-forest-800 border-forest-200 hover:bg-forest-100"
                        : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50"
                    }`}
                    title={isToday ? "Hari Ini" : undefined}
                  >
                    <span>{dayNum}</span>

                    {/* Today Pill Label Badge */}
                    {isToday && !isSelected && (
                      <span className="absolute -top-1.5 px-1 py-[1px] bg-lime text-forest-950 font-black text-[7px] rounded uppercase tracking-tighter shadow-sm">
                        HARI INI
                      </span>
                    )}

                    {/* Event Dot Badge Indicators */}
                    {hasEvents && !isToday && (
                      <span
                        className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                          isSelected
                            ? "bg-lime"
                            : hasPuasa
                            ? "bg-emerald-600"
                            : "bg-forest-600"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Monthly Hadith Quote */}
          {currentQuote && (
            <div className="mt-6 pt-4 border-t border-gray-100 bg-forest-50/60 p-4 rounded-2xl border border-forest-100">
              <div className="flex items-start gap-2 text-xs text-forest-900 leading-relaxed font-medium">
                <Quote className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                <div>
                  <p className="italic">“{currentQuote.text}”</p>
                  <strong className="text-forest-700 block font-bold mt-1 text-[11px]">— {currentQuote.source}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KANAN: Detail Agenda & Puasa */}
        <div className="lg:col-span-5 flex flex-col h-full w-full">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 md:p-6 flex flex-col flex-1 min-h-[380px]">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-black text-forest-900 text-base md:text-lg">
                {selectedDateStr ? "Detail Agenda" : `Agenda ${INDONESIAN_MONTHS[month]}`}
              </h3>
              {selectedDateStr && (
                <button
                  onClick={() => setSelectedDateStr(null)}
                  className="text-xs font-bold text-forest-600 hover:text-forest-800 transition-colors cursor-pointer"
                >
                  Tampilkan Semua
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 max-h-[420px] pr-1">
              {displayedEvents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <CalendarDays className="w-10 h-10 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-xs font-semibold">
                    {selectedDateStr
                      ? "Tidak ada agenda yang terjadwal pada tanggal ini."
                      : "Tidak ada agenda terjadwal di bulan ini."}
                  </p>
                </div>
              ) : (
                displayedEvents.map((event, index) => {
                  const isPuasa = event.type === "Puasa Sunnah" || event.isPuasa;
                  return (
                    <div
                      key={index}
                      className={`rounded-2xl p-4 border transition-all ${
                        isPuasa
                          ? "bg-emerald-50/60 border-emerald-200/80 hover:bg-emerald-50"
                          : "bg-gray-50/80 border-gray-100 hover:bg-gray-100/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider ${
                            isPuasa
                              ? "bg-emerald-600 text-white"
                              : "bg-forest-600 text-white"
                          }`}
                        >
                          {isPuasa ? <Moon className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                          {event.type}
                        </span>
                        <span className="text-[10px] font-extrabold text-gray-400 font-mono">
                          {new Date(event.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-forest-900 text-sm mb-2 leading-snug">
                        {event.title}
                      </h4>
                      
                      <div className="flex flex-col gap-1.5 text-xs text-gray-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
