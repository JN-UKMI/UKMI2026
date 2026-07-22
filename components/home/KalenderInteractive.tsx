"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  Moon,
  Sparkles,
  Quote,
  CalendarDays,
} from "lucide-react";
import type { EventItem } from "@/lib/types";

interface KalenderInteractiveProps {
  events: EventItem[];
  monthlyQuotes?: Record<string, { text: string; source: string }>;
  hijriMonths?: Record<string, string>;
}

const INDONESIAN_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAYS_OF_WEEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function KalenderInteractive({
  events,
  monthlyQuotes,
  hijriMonths,
}: KalenderInteractiveProps) {
  // Set initial date to current date
  const defaultDate = new Date();
  
  const [currentDate, setCurrentDate] = useState<Date>(defaultDate);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "kegiatan" | "puasa">("all");
  const [calendarHeight, setCalendarHeight] = useState<number>(0);
  const calendarCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (calendarCardRef.current) {
        setCalendarHeight(calendarCardRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const yearMonthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const hijriSubtext = hijriMonths?.[yearMonthKey] || "1447 Hijriah";

  // First day index (0 = Sunday, 1 = Monday) — week starts on Sunday
  const firstDayIndex = new Date(year, month, 1).getDay();
  const startOffset = firstDayIndex; // 0=Min, 1=Sen, dst

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

  const jumpToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`);
  };

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
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      
      {/* 1. TOP HEADER CONTROLLER: SEGMENTED PILL FILTER & TODAY BUTTON */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-3xl border border-gray-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        
        {/* Left: Filter Segmented Control */}
        <div className="flex items-center gap-1.5 bg-gray-100/80 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-white text-forest-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Semua ({events.length})
          </button>
          <button
            onClick={() => setActiveCategory("kegiatan")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeCategory === "kegiatan"
                ? "bg-forest-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Agenda UKMI
          </button>
          <button
            onClick={() => setActiveCategory("puasa")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeCategory === "puasa"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            🌙 Puasa Sunnah
          </button>
        </div>

        {/* Right: Quick Jump Today Button */}
        <button
          onClick={jumpToToday}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-200/80 rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 w-full sm:w-auto justify-center"
        >
          <CalendarIcon className="w-4 h-4 text-forest-600" />
          <span>Ke Tanggal Hari Ini</span>
        </button>
      </div>

      {/* 2. MAIN GRID: items-stretch — kiri menentukan tinggi, kanan menyesuaikan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">

        {/* KIRI: GRID KALENDER — tinggi alami, tidak diubah */}
        <div className="lg:col-span-7">
          <div
            ref={calendarCardRef}
            className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 md:p-7 flex flex-col justify-between relative overflow-hidden"
          >

            <div>
              {/* Header Bulan & Navigasi Panah */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-black text-forest-900 text-lg sm:text-2xl uppercase tracking-wider flex items-center gap-2">
                    {INDONESIAN_MONTHS[month]} {year}
                  </h3>
                  <span className="text-xs font-bold text-forest-700/80 block mt-0.5 font-mono">
                    {hijriSubtext}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2.5 rounded-2xl border border-gray-200 text-gray-600 hover:bg-forest-50 hover:text-forest-700 hover:border-forest-200 transition-all cursor-pointer active:scale-95"
                    aria-label="Bulan sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2.5 rounded-2xl border border-gray-200 text-gray-600 hover:bg-forest-50 hover:text-forest-700 hover:border-forest-200 transition-all cursor-pointer active:scale-95"
                    aria-label="Bulan berikutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Legenda Indikator */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-gray-500 mb-5 pb-3 border-b border-gray-100/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-forest-900 ring-2 ring-lime ring-offset-1" />
                  Hari Ini
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-lime rounded-full" />
                  Agenda UKMI
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Puasa Sunnah
                </span>
              </div>

              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 text-center font-black text-xs text-forest-900 mb-3 uppercase tracking-wider">
                {DAYS_OF_WEEK.map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar Days Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Previous month padding */}
                {Array.from({ length: startOffset }).map((_, i) => {
                  const dayNum = prevMonthTotalDays - startOffset + i + 1;
                  return (
                    <div
                      key={`prev-${i}`}
                      className="aspect-square flex items-center justify-center text-xs text-gray-300 pointer-events-none bg-gray-50/40 rounded-2xl min-w-[38px] min-h-[38px]"
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
                  const hasUkmiEvent = dayEvents.some((e) => e.type !== "Puasa Sunnah" && !e.isPuasa);
                  const isSelected = selectedDateStr === dateString;
                  const isToday = checkIsToday(dayNum);

                  return (
                    <button
                      key={`curr-${dayNum}`}
                      onClick={() => setSelectedDateStr(isSelected ? null : dateString)}
                      className={`relative aspect-square flex flex-col items-center justify-center text-xs sm:text-sm font-bold rounded-2xl transition-all border cursor-pointer active:scale-95 min-w-[38px] min-h-[38px] ${
                        isSelected
                          ? "bg-forest-900 text-white border-forest-900 shadow-md ring-2 ring-forest-600/30"
                          : isToday
                          ? "bg-forest-900 text-white border-forest-900 font-black shadow-md ring-2 ring-lime ring-offset-2"
                          : hasPuasa && hasUkmiEvent
                          ? "bg-emerald-50/90 text-emerald-950 border-emerald-300 font-black hover:bg-emerald-100"
                          : hasPuasa
                          ? "bg-emerald-50/70 text-emerald-900 border-emerald-200 font-bold hover:bg-emerald-100/80"
                          : hasUkmiEvent
                          ? "bg-forest-50/80 text-forest-900 border-forest-200 font-bold hover:bg-forest-100"
                          : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <span className="leading-none">{dayNum}</span>

                      {/* Today Badge Pill */}
                      {isToday && !isSelected && (
                        <span className="absolute -top-1 px-1 py-[1px] bg-lime text-forest-950 font-black text-[6.5px] rounded-md uppercase tracking-tighter shadow-sm">
                          HARI INI
                        </span>
                      )}

                      {/* Multi-Pill Micro Badges */}
                      {hasEvents && !isToday && (
                        <div className="absolute bottom-1.5 flex items-center justify-center gap-1">
                          {hasUkmiEvent && (
                            <span className={`w-2 h-1 rounded-full ${isSelected ? "bg-lime" : "bg-forest-600"}`} />
                          )}
                          {hasPuasa && (
                            <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-emerald-600"}`} />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monthly Hadith Quote Highlight Box */}
            {currentQuote && (
              <div className="mt-6 pt-5 border-t border-gray-100 bg-forest-50/70 p-4 sm:p-5 rounded-2xl border border-forest-100 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm text-forest-950 italic leading-relaxed font-medium">
                      “{currentQuote.text}”
                    </p>
                    <span className="text-[11px] font-bold text-forest-700 block mt-1.5">
                      — {currentQuote.source}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KANAN: AGENDA CARD — tinggi disamakan dengan card kalender via ref */}
        <div className="lg:col-span-5">
          <div
            className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 md:p-7 flex flex-col overflow-hidden"
            style={{ height: calendarHeight > 0 ? `${calendarHeight}px` : "auto" }}
          >
            
            {/* Header Right Pane */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4 shrink-0">
              <div>
                <h3 className="font-black text-forest-900 text-base md:text-lg uppercase tracking-wider">
                  {selectedDateStr ? "Detail Agenda Tanggal" : `Agenda ${INDONESIAN_MONTHS[month]}`}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {displayedEvents.length} agenda ditemukan
                </p>
              </div>

              {selectedDateStr && (
                <button
                  onClick={() => setSelectedDateStr(null)}
                  className="text-xs font-bold text-forest-600 hover:text-forest-800 transition-colors cursor-pointer bg-forest-50 px-3 py-1.5 rounded-xl border border-forest-100 shrink-0"
                >
                  Tampilkan Bulan Ini Saja
                </button>
              )}
            </div>

            {/* Agenda Cards — scroll di dalam card sesuai sisa tinggi */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-1">
              {displayedEvents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <CalendarDays className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-xs font-bold">
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
                          ? "bg-emerald-50/70 border-emerald-200/80 hover:bg-emerald-50 shadow-xs"
                          : "bg-gray-50/80 border-gray-100 hover:bg-gray-100/70 shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider ${
                            isPuasa
                              ? "bg-emerald-600 text-white"
                              : "bg-forest-900 text-white"
                          }`}
                        >
                          {isPuasa ? <Moon className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                          {event.type}
                        </span>

                        <span className="text-[10px] font-black text-gray-500 font-mono">
                          {new Date(event.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      
                      <h4 className="font-black text-forest-900 text-sm md:text-base mb-2.5 leading-snug">
                        {event.title}
                      </h4>
                      
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600 font-medium">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-gray-200/60 shadow-xs">
                          <Clock className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-gray-200/60 shadow-xs">
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
