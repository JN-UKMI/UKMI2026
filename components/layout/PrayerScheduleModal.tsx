"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  MapPin,
  Compass,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Sparkles,
  RefreshCw,
  Calendar,
} from "lucide-react";
import type { PrayerData, PrayerTimings } from "@/lib/prayer-times";
import {
  getNextPrayer,
  getCurrentPrayerWindow,
  formatRemainingTime,
  MAIN_PRAYERS,
} from "@/lib/prayer-times";

interface PrayerScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerData: PrayerData | null;
  isLoading: boolean;
  onRefreshLocation: () => void;
  isDetectingLocation: boolean;
}

const PRAYER_ICONS: Record<string, typeof Sun> = {
  Imsak: Moon,
  Subuh: Sunrise,
  Terbit: Sun,
  Dzuhur: Sun,
  Ashar: Sun,
  Maghrib: Sunset,
  Isya: Moon,
};

export function PrayerScheduleModal({
  isOpen,
  onClose,
  prayerData,
  isLoading,
  onRefreshLocation,
  isDetectingLocation,
}: PrayerScheduleModalProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live second-by-second digital clock
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const now = currentTime || new Date();
  const timings = prayerData?.timings;
  const nextPrayer = timings ? getNextPrayer(timings, now) : null;
  const currentWindow = timings ? getCurrentPrayerWindow(timings, now) : null;

  const formattedLiveTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const formattedDate = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-white/95 dark:bg-forest-950/95 border border-forest-100 dark:border-lime/30 rounded-3xl shadow-2xl overflow-hidden z-10 backdrop-blur-xl"
          >
          {/* Header Bar */}
          <div className="relative px-6 pt-6 pb-4 border-b border-gray-100 dark:border-forest-800/80 bg-gradient-to-br from-forest-50/70 via-transparent to-lime/5 dark:from-forest-900/50 dark:to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-forest-600 dark:bg-lime/20 border border-forest-500/20 dark:border-lime/40 flex items-center justify-center text-white dark:text-lime shadow-inner">
                  <Compass className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-forest-950 dark:text-gray-100">
                    Jadwal Sholat
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-forest-600 dark:text-lime shrink-0" />
                    <span className="font-medium truncate max-w-[200px]">
                      {prayerData?.locationName || "Surakarta & Sekitarnya"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onRefreshLocation}
                  disabled={isDetectingLocation}
                  title="Deteksi lokasi saya (GPS)"
                  className="p-2 text-gray-500 hover:text-forest-700 dark:text-gray-400 dark:hover:text-lime bg-gray-100/80 dark:bg-forest-900/60 rounded-xl hover:bg-forest-100 dark:hover:bg-forest-800 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isDetectingLocation ? "animate-spin text-lime" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup popup"
                  className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100/80 dark:bg-forest-900/60 rounded-xl hover:bg-gray-200 dark:hover:bg-forest-800 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Live Clock & Next Prayer Highlight */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-forest-800 via-forest-900 to-forest-950 text-white shadow-lg border border-forest-700/50 relative overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-lime text-xs font-semibold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Waktu Sekarang</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-black tracking-tight mt-0.5 text-white">
                    {formattedLiveTime}{" "}
                    <span className="text-xs font-sans text-forest-300 font-semibold">WIB</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-forest-200 mt-1">
                    <Calendar className="w-3 h-3 text-lime" />
                    <span>{formattedDate}</span>
                    {prayerData?.hijri && (
                      <>
                        <span className="text-forest-400">•</span>
                        <span className="text-lime/90 font-medium">{prayerData.hijri}</span>
                      </>
                    )}
                  </div>
                </div>

                {nextPrayer && (
                  <div className="sm:text-right bg-white/10 dark:bg-forest-950/40 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10 sm:border-lime/20">
                    <div className="text-[11px] text-forest-200 uppercase tracking-wider font-semibold">
                      Sholat Selanjutnya
                    </div>
                    <div className="text-lg font-black text-lime">
                      {nextPrayer.name}{" "}
                      <span className="text-white font-mono text-base font-bold">
                        {nextPrayer.time}
                      </span>
                    </div>
                    <div className="text-[11px] text-forest-300 font-medium flex items-center sm:justify-end gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3 text-lime shrink-0" />
                      <span>{formatRemainingTime(nextPrayer.minutesRemaining)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prayer Times Grid */}
          <div className="p-6">
            {isLoading || !timings ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
                <RefreshCw className="w-6 h-6 animate-spin text-lime" />
                <span className="text-sm font-medium">Memuat jadwal waktu sholat...</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 pb-2 mb-2 border-b border-gray-100 dark:border-forest-900/60">
                  {/* Imsak */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-forest-900/40 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                      <Moon className="w-3.5 h-3.5 text-forest-500 dark:text-lime" />
                      <span className="font-semibold">Imsak</span>
                    </div>
                    <span className="font-mono font-bold text-forest-900 dark:text-gray-200">
                      {timings.Imsak}
                    </span>
                  </div>
                  {/* Terbit */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-forest-900/40 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                      <Sunrise className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-semibold">Terbit</span>
                    </div>
                    <span className="font-mono font-bold text-forest-900 dark:text-gray-200">
                      {timings.Terbit}
                    </span>
                  </div>
                </div>

                {/* 5 Main Prayers */}
                {MAIN_PRAYERS.map((name) => {
                  const time = timings[name];
                  const isNext = nextPrayer?.name === name;
                  const isCurrent = currentWindow === name;
                  const Icon = PRAYER_ICONS[name] || Sun;

                  return (
                    <div
                      key={name}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${
                        isNext
                          ? "bg-forest-700 text-white ring-2 ring-lime/80 shadow-md shadow-forest-900/20"
                          : isCurrent
                          ? "bg-lime/15 dark:bg-lime/10 border border-lime/50 text-forest-900 dark:text-gray-100"
                          : "bg-gray-50/80 dark:bg-forest-900/50 hover:bg-forest-50 dark:hover:bg-forest-900 text-gray-800 dark:text-gray-200 border border-gray-100/60 dark:border-forest-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isNext
                              ? "bg-lime text-forest-950 font-bold"
                              : isCurrent
                              ? "bg-forest-600 text-white dark:bg-lime dark:text-forest-950"
                              : "bg-white dark:bg-forest-800 text-forest-600 dark:text-lime shadow-xs"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold text-sm sm:text-base ${
                                isNext ? "text-white" : ""
                              }`}
                            >
                              {name}
                            </span>
                            {isNext && (
                              <span className="text-[10px] uppercase font-bold bg-lime text-forest-950 px-2 py-0.5 rounded-full shadow-xs">
                                Selanjutnya
                              </span>
                            )}
                            {isCurrent && !isNext && (
                              <span className="text-[10px] uppercase font-bold bg-forest-600 dark:bg-lime text-white dark:text-forest-950 px-2 py-0.5 rounded-full shadow-xs">
                                Sekarang
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-base sm:text-lg font-black tracking-tight ${
                            isNext
                              ? "text-lime"
                              : "text-forest-900 dark:text-lime"
                          }`}
                        >
                          {time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer Reminder */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-forest-900/80 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1 italic">
                <Sparkles className="w-3 h-3 text-lime" />
                &quot;Sholatlah tepat pada waktunya.&quot;
              </span>
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                Kemenag RI / Aladhan API
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>,
  document.body
);
}
