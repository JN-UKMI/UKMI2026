export interface PrayerTimings {
  Imsak: string;
  Subuh: string;
  Terbit: string;
  Dzuhur: string;
  Ashar: string;
  Maghrib: string;
  Isya: string;
}

export interface PrayerData {
  locationName: string;
  latitude: number;
  longitude: number;
  date: string;
  hijri?: string;
  timings: PrayerTimings;
}

export interface NextPrayerInfo {
  name: string;
  time: string;
  minutesRemaining: number;
  isPassedToday: boolean;
}

export const PRAYER_NAMES: (keyof PrayerTimings)[] = [
  "Imsak",
  "Subuh",
  "Terbit",
  "Dzuhur",
  "Ashar",
  "Maghrib",
  "Isya",
];

export const MAIN_PRAYERS: (keyof PrayerTimings)[] = [
  "Subuh",
  "Dzuhur",
  "Ashar",
  "Maghrib",
  "Isya",
];

/**
 * Parses "HH:mm" string into total minutes from start of day.
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Determines the next prayer given the prayer timings and current Date.
 */
export function getNextPrayer(timings: PrayerTimings, now = new Date()): NextPrayerInfo {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // We check main 5 prayers for next prayer announcement
  for (const name of MAIN_PRAYERS) {
    const prayerMinutes = timeStringToMinutes(timings[name]);
    if (prayerMinutes > currentMinutes) {
      return {
        name,
        time: timings[name],
        minutesRemaining: prayerMinutes - currentMinutes,
        isPassedToday: false,
      };
    }
  }

  // If passed Isya, the next prayer is Subuh tomorrow
  const subuhMinutes = timeStringToMinutes(timings.Subuh);
  const minutesUntilMidnight = 24 * 60 - currentMinutes;
  const minutesRemaining = minutesUntilMidnight + subuhMinutes;

  return {
    name: "Subuh",
    time: timings.Subuh,
    minutesRemaining,
    isPassedToday: true,
  };
}

/**
 * Returns which prayer window is currently active (e.g. between Subuh and Dzuhur, Dzuhur and Ashar, etc.)
 */
export function getCurrentPrayerWindow(timings: PrayerTimings, now = new Date()): keyof PrayerTimings {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const subuh = timeStringToMinutes(timings.Subuh);
  const dzuhur = timeStringToMinutes(timings.Dzuhur);
  const ashar = timeStringToMinutes(timings.Ashar);
  const maghrib = timeStringToMinutes(timings.Maghrib);
  const isya = timeStringToMinutes(timings.Isya);

  if (currentMinutes >= subuh && currentMinutes < dzuhur) return "Subuh";
  if (currentMinutes >= dzuhur && currentMinutes < ashar) return "Dzuhur";
  if (currentMinutes >= ashar && currentMinutes < maghrib) return "Ashar";
  if (currentMinutes >= maghrib && currentMinutes < isya) return "Maghrib";
  return "Isya";
}

/**
 * Format remaining minutes into human-friendly string (e.g. "45 mnt lagi", "2 jam 10 mnt lagi")
 */
export function formatRemainingTime(minutes: number): string {
  if (minutes <= 0) return "Waktunya sekarang";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} mnt lagi`;
  if (mins === 0) return `${hours} jam lagi`;
  return `${hours} jam ${mins} mnt lagi`;
}
