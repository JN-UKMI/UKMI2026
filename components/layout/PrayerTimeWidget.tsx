"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Clock, Compass, Sun, Sunrise, Sunset, Moon } from "lucide-react";
import type { PrayerData } from "@/lib/prayer-times";
import { getNextPrayer } from "@/lib/prayer-times";
import { PrayerScheduleModal } from "./PrayerScheduleModal";

const PRAYER_ICONS: Record<string, typeof Sun> = {
  Imsak: Moon,
  Subuh: Sunrise,
  Terbit: Sun,
  Dzuhur: Sun,
  Ashar: Sun,
  Maghrib: Sunset,
  Isya: Moon,
};

export function PrayerTimeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  // Keep live time updated every minute for widget display
  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTimings = useCallback(async (lat?: number, lng?: number, city?: string) => {
    setIsLoading(true);
    try {
      let url = "/api/jadwal-sholat";
      const params = new URLSearchParams();
      if (lat !== undefined && lng !== undefined) {
        params.set("lat", lat.toString());
        params.set("lng", lng.toString());
      }
      if (city) {
        params.set("city", city);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          setPrayerData(data);
        }
      }
    } catch (err) {
      console.error("[PrayerTimeWidget] Failed to fetch prayer times:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch (default to Surakarta)
  useEffect(() => {
    // Check if user previously had saved coords in sessionStorage
    const savedCoords = sessionStorage.getItem("user_coords");
    if (savedCoords) {
      try {
        const parsed = JSON.parse(savedCoords);
        if (parsed.lat && parsed.lng) {
          fetchTimings(parsed.lat, parsed.lng, parsed.city);
          return;
        }
      } catch {}
    }
    fetchTimings();
  }, [fetchTimings]);

  // Handle GPS location detection
  const handleDetectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolokasi tidak didukung oleh browser Anda.");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        sessionStorage.setItem(
          "user_coords",
          JSON.stringify({ lat, lng, city: "Lokasi Anda" })
        );
        await fetchTimings(lat, lng, "Lokasi Anda");
        setIsDetectingLocation(false);
      },
      (err) => {
        console.warn("Geolocation permission denied or failed:", err);
        setIsDetectingLocation(false);
        // Fallback fetch default
        fetchTimings();
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }, [fetchTimings]);

  const timings = prayerData?.timings;
  const nextPrayer = timings && now ? getNextPrayer(timings, now) : null;
  const NextIcon = nextPrayer ? PRAYER_ICONS[nextPrayer.name] || Clock : Clock;

  return (
    <>
      <motion.button
        type="button"
        whileHover={{ y: -1.5, scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(true)}
        aria-label="Lihat jadwal sholat lengkap"
        title="Klik untuk melihat Jadwal Sholat Lengkap"
        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-transparent hover:bg-forest-50/80 dark:hover:bg-forest-950/60 text-forest-900 dark:text-gray-100 border border-gray-300/80 dark:border-lime/40 hover:border-forest-600 dark:hover:border-lime transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-forest-600/10 dark:bg-lime/10 border border-forest-600/20 dark:border-lime/30 text-forest-600 dark:text-lime shrink-0 group-hover:border-lime/60 transition-colors">
          <NextIcon className="w-3.5 h-3.5" />
        </div>

        <div className="flex flex-col text-left leading-none gap-0.5">
          {isLoading || !nextPrayer ? (
            <>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                SHOLAT
              </span>
              <span className="text-xs font-mono font-black text-forest-600 dark:text-lime">
                --:--
              </span>
            </>
          ) : (
            <>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">
                {nextPrayer.name}
              </span>
              <span className="text-xs font-mono font-black text-forest-950 dark:text-lime tracking-tight">
                {nextPrayer.time}
              </span>
            </>
          )}
        </div>
      </motion.button>

      <PrayerScheduleModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        prayerData={prayerData}
        isLoading={isLoading}
        onRefreshLocation={handleDetectLocation}
        isDetectingLocation={isDetectingLocation}
      />
    </>
  );
}
