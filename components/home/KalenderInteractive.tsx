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
import { useIsTouchDevice } from "@/lib/hooks";

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

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export function KalenderInteractive({
  events,
  monthlyQuotes,
  hijriMonths,
}: KalenderInteractiveProps) {
  // Clamp default date to 2026 (January 2026 if current year is not 2026)
  const getInitial2026Date = () => {
    const now = new Date();
    if (now.getFullYear() === 2026) return now;
    return new Date(2026, 0, 1);
  };

  const [currentDate, setCurrentDate] = useState<Date>(getInitial2026Date());
  const [[monthPage, direction], setMonthPage] = useState<[number, number]>([0, 0]);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "kegiatan" | "puasa">("all");
  const [calendarHeight, setCalendarHeight] = useState(0);
  const calendarCardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isTouchDevice = useIsTouchDevice();

  // Track calendar card height so agenda scroll area matches it (desktop only)
  useEffect(() => {
    const el = calendarCardRef.current;
    if (!el) return;
    const update = () => {
      if (window.innerWidth >= 1024 && el) {
        // Subtract header + padding of the agenda card
        setCalendarHeight(el.offsetHeight - 140);
      } else {
        setCalendarHeight(0);
      }
    };
    const obs = new ResizeObserver(update);
    obs.observe(el);
    update();
    window.addEventListener("resize", update);
    return () => {
      obs.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const yearMonthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const hijriSubtext = hijriMonths?.[yearMonthKey] || "1447 Hijriah";

  // Check bounds: Strict limit January 2026 to December 2026
  const isMinMonth = year === 2026 && month === 0;
  const isMaxMonth = year === 2026 && month === 11;

  // First day index (0 = Sunday, 1 = Monday) — week starts on Sunday
  const firstDayIndex = new Date(year, month, 1).getDay();
  const startOffset = firstDayIndex; // 0=Min, 1=Sen, dst

  // Days in month
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    if (isMinMonth) return;
    setMonthPage([monthPage - 1, -1]);
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDateStr(null);
  };

  const handleNextMonth = () => {
    if (isMaxMonth) return;
    setMonthPage([monthPage + 1, 1]);
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDateStr(null);
  };

  const jumpToToday = () => {
    const now = new Date();
    const targetDate = now.getFullYear() === 2026 ? now : new Date(2026, 0, 1);
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    const currentAbsoluteMonth = targetYear * 12 + targetMonth;
    const stateAbsoluteMonth = year * 12 + month;
    if (currentAbsoluteMonth === stateAbsoluteMonth) return;

    const newDir = currentAbsoluteMonth > stateAbsoluteMonth ? 1 : -1;
    setMonthPage([monthPage + (currentAbsoluteMonth - stateAbsoluteMonth), newDir]);
    setCurrentDate(targetDate);
    setSelectedDateStr(`${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`);
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
    <motion.div 
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 60, damping: 15 }}
      className="flex flex-col gap-8 w-full max-w-6xl mx-auto"
    >
      
      {/* 1. TOP HEADER CONTROLLER: SEGMENTED PILL FILTER & TODAY BUTTON */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Filter Segmented Control — TentangTabs style */}
        <div className="glass rounded-2xl p-1.5 shadow-sm border-2 border-lime dark:border-lime flex flex-nowrap gap-1 w-full sm:w-auto relative">
          <button
            onClick={() => {
              setMonthPage([monthPage, 0]);
              setActiveCategory("all");
            }}
            className={`group/tab relative flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime dark:focus-visible:outline-lime z-10 ${
              activeCategory === "all"
                ? "text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {activeCategory === "all" && (
              <motion.div
                layoutId={shouldReduceMotion ? undefined : "activeCategoryTab"}
                className="absolute inset-0 bg-forest-600 rounded-xl shadow-md shadow-forest-600/20"
                transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 inline-block">
              <CalendarDays className="relative z-10 w-3.5 h-3.5 inline mr-1" />
              Semua ({events.length})
              {!shouldReduceMotion && activeCategory !== "all" && (
                <span aria-hidden className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-forest-600 dark:bg-lime transition-[width] duration-300 motion-reduce:transition-none group-hover/tab:w-full group-focus-visible/tab:w-full" />
              )}
            </span>
          </button>
          <button
            onClick={() => {
              setMonthPage([monthPage, 0]);
              setActiveCategory("kegiatan");
            }}
            className={`group/tab relative flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime dark:focus-visible:outline-lime z-10 ${
              activeCategory === "kegiatan"
                ? "text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {activeCategory === "kegiatan" && (
              <motion.div
                layoutId={shouldReduceMotion ? undefined : "activeCategoryTab"}
                className="absolute inset-0 bg-forest-600 rounded-xl shadow-md shadow-forest-600/20"
                transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 inline-block">
              <Sparkles className="relative z-10 w-3.5 h-3.5 inline mr-1" />
              Agenda UKMI
              {!shouldReduceMotion && activeCategory !== "kegiatan" && (
                <span aria-hidden className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-forest-600 dark:bg-lime transition-[width] duration-300 motion-reduce:transition-none group-hover/tab:w-full group-focus-visible/tab:w-full" />
              )}
            </span>
          </button>
          <button
            onClick={() => {
              setMonthPage([monthPage, 0]);
              setActiveCategory("puasa");
            }}
            className={`group/tab relative flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime dark:focus-visible:outline-lime z-10 ${
              activeCategory === "puasa"
                ? "text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {activeCategory === "puasa" && (
              <motion.div
                layoutId={shouldReduceMotion ? undefined : "activeCategoryTab"}
                className="absolute inset-0 bg-forest-600 rounded-xl shadow-md shadow-forest-600/20"
                transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 inline-block">
              <Moon className="relative z-10 w-3.5 h-3.5 inline mr-1" />
              Puasa Sunnah
              {!shouldReduceMotion && activeCategory !== "puasa" && (
                <span aria-hidden className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-forest-600 dark:bg-lime transition-[width] duration-300 motion-reduce:transition-none group-hover/tab:w-full group-focus-visible/tab:w-full" />
              )}
            </span>
          </button>
        </div>

        {/* Right: Quick Jump Today Button */}
        <button
          onClick={jumpToToday}
          className="group/today relative isolate inline-flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-2xl border border-lime dark:border-lime bg-transparent px-4 py-2.5 text-xs font-bold text-forest-700 dark:text-lime shadow-sm transition-colors duration-300 hover:shadow-md motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 motion-reduce:transform-none motion-reduce:transition-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-forest-600 dark:bg-lime motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-0 group-hover/today:translate-x-0"
          />
          <span className="relative z-10 inline-flex items-center justify-center gap-2 transition-colors duration-300 motion-reduce:transition-none group-hover/today:text-white dark:group-hover/today:text-forest-950">
            <CalendarIcon className="w-4 h-4 text-forest-600 dark:text-lime transition-colors duration-300 motion-reduce:transition-none group-hover/today:text-white dark:group-hover/today:text-forest-950" />
            <span>Ke Tanggal Hari Ini</span>
          </span>
        </button>
      </div>

      {/* 2. MAIN GRID: items-stretch — kiri menentukan tinggi, kanan menyesuaikan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">

        {/* KIRI: GRID KALENDER — tinggi alami, tidak diubah */}
        <div className="lg:col-span-7">
          <div
            ref={calendarCardRef}
            className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-forest-600 dark:border-lime shadow-sm p-6 md:p-7 flex flex-col justify-between relative overflow-hidden transition-colors"
          >

            <div>
              {/* Header Bulan & Navigasi Panah */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="font-black text-forest-900 dark:text-lime text-lg sm:text-2xl uppercase tracking-wider flex items-center gap-2">
                    {INDONESIAN_MONTHS[month]} {year}
                  </h3>
                  <span className="text-xs font-bold text-forest-700/80 dark:text-gray-400 block mt-0.5 font-mono">
                    {hijriSubtext}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    disabled={isMinMonth}
                    className={`p-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50 ${
                      isMinMonth
                        ? "opacity-30 cursor-not-allowed text-gray-400 dark:text-gray-600"
                        : "text-gray-600 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-gray-800 hover:text-forest-700 dark:hover:text-lime cursor-pointer active:scale-95"
                    }`}
                    aria-label="Bulan sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    disabled={isMaxMonth}
                    className={`p-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50 ${
                      isMaxMonth
                        ? "opacity-30 cursor-not-allowed text-gray-400 dark:text-gray-600"
                        : "text-gray-600 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-gray-800 hover:text-forest-700 dark:hover:text-lime cursor-pointer active:scale-95"
                    }`}
                    aria-label="Bulan berikutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Legenda Indikator Warna Bidang */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-5 pb-3 border-b border-gray-100/60 dark:border-gray-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-forest-900 dark:bg-lime ring-2 ring-lime dark:ring-lime/50 ring-offset-1 dark:ring-offset-gray-900" />
                  Hari Ini
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-950 border border-gray-700" />
                  Ketum
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  Sekum
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-lime dark:bg-lime" />
                  Syiar
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-700" />
                  Internal
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-800" />
                  Eksternal
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  Kemus
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Bendum
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  Puasa
                </span>
              </div>

              <div className="relative overflow-hidden w-full">
                <AnimatePresence
                mode={shouldReduceMotion || isTouchDevice ? "wait" : "popLayout"}
                initial={false}
                custom={direction}
              >
                  <motion.div
                    key={`${monthPage}-${activeCategory}`}
                    custom={direction}
                    variants={{
                      enter: (dir: number) => ({
                        x:
                          shouldReduceMotion || isTouchDevice
                            ? 0
                            : dir === 0
                            ? 0
                            : dir > 0
                            ? "100%"
                            : "-100%",
                        opacity: 0,
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                      },
                      exit: (dir: number) => ({
                        x:
                          shouldReduceMotion || isTouchDevice
                            ? 0
                            : dir === 0
                            ? 0
                            : dir < 0
                            ? "100%"
                            : "-100%",
                        opacity: 0,
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x:
                        shouldReduceMotion || isTouchDevice
                          ? undefined
                          : { type: "spring", stiffness: 300, damping: 32 },
                      opacity: {
                        duration: shouldReduceMotion || isTouchDevice ? 0.1 : 0.2,
                      },
                    }}
                  >
                    {/* Days of week header */}
                    <div className="grid grid-cols-7 gap-1 text-center font-black text-xs text-forest-900 dark:text-lime mb-3 uppercase tracking-wider">
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
                            className="aspect-square flex items-center justify-center text-xs font-medium text-gray-400/40 dark:text-gray-600 pointer-events-none bg-gray-50/30 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-200/60 dark:border-gray-800/80 min-w-[38px] min-h-[38px]"
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
                            className={`relative aspect-square flex flex-col items-center justify-center text-xs sm:text-sm font-bold rounded-2xl transition-all border-2 cursor-pointer active:scale-95 min-w-[38px] min-h-[38px] shadow-2xs ${
                              isSelected
                                ? "bg-forest-900 dark:bg-forest-600 text-white border-forest-900 dark:border-lime shadow-lg ring-4 ring-forest-600/30 dark:ring-lime/40 scale-[1.03]"
                                : isToday
                                ? "bg-forest-900 dark:bg-gray-800 text-white dark:text-lime border-forest-900 dark:border-lime font-black shadow-md ring-4 ring-forest-500/20 dark:ring-lime/30"
                                : hasPuasa && hasUkmiEvent
                                ? "bg-white dark:bg-gray-800 text-forest-950 dark:text-lime border-2 border-emerald-500 dark:border-emerald-400 font-black hover:border-emerald-600 dark:hover:border-emerald-300 hover:shadow-xs"
                                : hasPuasa
                                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-emerald-500 dark:border-emerald-400 font-bold hover:border-emerald-600 dark:hover:border-emerald-300 hover:shadow-xs"
                                : hasUkmiEvent
                                ? "bg-forest-50/80 dark:bg-forest-950/50 text-forest-900 dark:text-lime border-forest-300 dark:border-forest-700 font-bold hover:border-lime dark:hover:border-lime hover:shadow-xs"
                                : "bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:border-lime dark:hover:border-lime hover:shadow-md hover:shadow-forest-900/10 dark:hover:shadow-lime/10 motion-safe:hover:-translate-y-0.5"
                            }`}
                          >
                            <span className="leading-none">{dayNum}</span>

                            {/* Today Badge Pill */}
                            {isToday && !isSelected && (
                              <span className="absolute -top-1 px-1 py-[1px] bg-lime text-forest-950 font-black text-[6.5px] rounded-md uppercase tracking-tighter shadow-sm">
                                HARI INI
                              </span>
                            )}

                            {/* Multi-Pill Micro Badges for Exact Bidang Colors */}
                            {hasEvents && !isToday && (
                              <div className="absolute bottom-1.5 flex items-center justify-center gap-1">
                                {dayEvents.map((e, idx) => {
                                  let dotColor = "bg-lime dark:bg-lime";
                                  if (e.type === "Puasa Sunnah" || e.isPuasa) {
                                    dotColor = "bg-emerald-500 dark:bg-emerald-400";
                                  } else if (e.type === "Ketum") {
                                    dotColor = "bg-gray-950 dark:bg-white";
                                  } else if (e.type === "Sekum") {
                                    dotColor = "bg-purple-600 dark:bg-purple-400";
                                  } else if (e.type === "Syiar") {
                                    dotColor = "bg-lime dark:bg-lime";
                                  } else if (e.type === "Internal") {
                                    dotColor = "bg-red-700 dark:bg-red-500";
                                  } else if (e.type === "Eksternal") {
                                    dotColor = "bg-amber-800 dark:bg-amber-500";
                                  } else if (e.type === "Kemus") {
                                    dotColor = "bg-pink-500 dark:bg-pink-400";
                                  } else if (e.type === "Bendum") {
                                    dotColor = "bg-rose-500 dark:bg-rose-400";
                                  }

                                  return (
                                    <span
                                      key={idx}
                                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : dotColor}`}
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Monthly Hadith Quote Highlight Box */}
            {currentQuote && (
              <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-5">
                <div className="bg-gradient-to-br from-forest-900 via-forest-800 to-black text-white p-5 rounded-2xl border border-white/10 relative overflow-hidden shadow-lg">
                  <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-lime/10 blur-xl pointer-events-none" />
                  <div className="flex items-start gap-3.5 relative z-10">
                    <Quote className="w-5 h-5 text-lime shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-100 italic leading-relaxed font-medium">
                        “{currentQuote.text}”
                      </p>
                      <span className="text-[11px] font-bold text-lime block mt-2 tracking-wide">
                        — {currentQuote.source}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KANAN: AGENDA CARD — ukuran natural, scroll internal */}
        <div className="lg:col-span-5">
          <div
            className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-forest-600 dark:border-lime shadow-sm p-6 md:p-7 flex flex-col transition-colors"
          >
            
            {/* Header Right Pane */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4 shrink-0">
              <div>
                <h3 className="font-black text-forest-900 dark:text-lime text-base md:text-lg uppercase tracking-wider">
                  {selectedDateStr ? "Detail Agenda Tanggal" : `Agenda ${INDONESIAN_MONTHS[month]}`}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {displayedEvents.length} agenda ditemukan
                </p>
              </div>

              {selectedDateStr && (
                <button
                  onClick={() => setSelectedDateStr(null)}
                  className="text-xs font-bold text-forest-600 dark:text-lime hover:text-forest-800 dark:hover:text-white transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-sm cursor-pointer bg-forest-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-forest-100 dark:border-gray-700 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40"
                >
                  Tampilkan Bulan Ini Saja
                </button>
              )}
            </div>

            {/* Agenda Cards — scrollable container with wheel capture */}
            <div
              className="overflow-y-auto overflow-x-hidden pr-1 relative max-h-[380px]"
              style={calendarHeight > 0 ? { maxHeight: calendarHeight } : undefined}
              onWheel={(e) => {
                const el = e.currentTarget;
                const atTop = el.scrollTop <= 0;
                const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
                // If scrolling down and at bottom, let page scroll
                // If scrolling up and at top, let page scroll
                // Otherwise, capture the scroll
                if ((e.deltaY > 0 && atBottom) || (e.deltaY < 0 && atTop)) return;
                e.stopPropagation();
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={(selectedDateStr || "month") + monthPage + activeCategory}
                  initial={{
                    opacity: 0,
                    x: direction === 0 ? 0 : direction > 0 ? 30 : -30,
                    y: direction === 0 ? 10 : 0,
                  }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{
                    opacity: 0,
                    x: direction === 0 ? 0 : direction > 0 ? -30 : 30,
                    y: direction === 0 ? -10 : 0,
                  }}
                  transition={{
                    x: { type: "spring", stiffness: 350, damping: 30 },
                    y: { type: "spring", stiffness: 350, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="space-y-3.5"
                >
                  {displayedEvents.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16">
                      <CalendarDays className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-bold">
                        {selectedDateStr
                          ? "Tidak ada agenda yang terjadwal pada tanggal ini."
                          : "Tidak ada agenda terjadwal di bulan ini."}
                      </p>
                    </div>
                  ) : (
                    displayedEvents.map((event, index) => {
                      const isPuasa = event.type === "Puasa Sunnah" || event.isPuasa;
                      return (
                        <motion.div
                          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                          transition={{ duration: 0.2 }}
                          key={event.date + event.title + index}
                          className={`p-4 rounded-2xl border transition-all duration-300 ${
                            isPuasa
                              ? "bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-100/80 dark:border-emerald-800/60 hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] dark:hover:shadow-[0_0_18px_rgba(52,211,153,0.3)]"
                              : "bg-forest-50/40 dark:bg-forest-950/40 border-forest-100/85 dark:border-forest-800/60 hover:border-lime dark:hover:border-lime hover:shadow-[0_0_15px_rgba(37,95,56,0.25)] dark:hover:shadow-[0_0_18px_rgba(142,205,4,0.35)]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider ${
                                isPuasa
                                  ? "bg-emerald-600 dark:bg-emerald-700 text-white"
                                  : event.type === "Ketum"
                                  ? "bg-gray-950 text-white border border-gray-700"
                                  : event.type === "Sekum"
                                  ? "bg-purple-700 text-white"
                                  : event.type === "Syiar"
                                  ? "bg-lime dark:bg-lime dark:text-forest-950 text-forest-950"
                                  : event.type === "Internal"
                                  ? "bg-red-800 text-white"
                                  : event.type === "Eksternal"
                                  ? "bg-amber-800 text-white"
                                  : event.type === "Kemus"
                                  ? "bg-pink-600 text-white"
                                  : event.type === "Bendum"
                                  ? "bg-rose-500 text-white"
                                  : "bg-forest-900 dark:bg-forest-700 text-white dark:text-lime"
                              }`}
                            >
                              {isPuasa ? <Moon className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                              {event.type}
                            </span>

                            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 font-mono">
                              {new Date(event.date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <h4 className="font-black text-forest-900 dark:text-lime text-sm md:text-base mb-2.5 leading-snug">
                            {event.title}
                          </h4>

                          <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300 font-medium">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200/60 dark:border-gray-700 shadow-xs">
                              <Clock className="w-3.5 h-3.5 text-forest-600 dark:text-lime shrink-0" />
                              <span>{event.time}</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200/60 dark:border-gray-700 shadow-xs">
                              <MapPin className="w-3.5 h-3.5 text-forest-600 dark:text-lime shrink-0" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}
