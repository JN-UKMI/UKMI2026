import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Default coordinates for Surakarta / Solo (JN UKMI UNS)
const DEFAULT_LAT = -7.5584;
const DEFAULT_LNG = 110.8542;
const DEFAULT_CITY = "Surakarta & Sekitarnya";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const cityParam = searchParams.get("city");

  const latitude = latParam ? parseFloat(latParam) : DEFAULT_LAT;
  const longitude = lngParam ? parseFloat(lngParam) : DEFAULT_LNG;

  // Validate coordinates
  const validLat = !isNaN(latitude) && latitude >= -90 && latitude <= 90 ? latitude : DEFAULT_LAT;
  const validLng = !isNaN(longitude) && longitude >= -180 && longitude <= 180 ? longitude : DEFAULT_LNG;

  try {
    // Aladhan API using Kemenag calculation method (method=20 or method=11)
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const aladhanUrl = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${validLat}&longitude=${validLng}&method=20`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(aladhanUrl, {
      signal: controller.signal,
      next: { revalidate: 3600 }, // Cache 1 hour
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const timings = data.data?.timings;
      const hijriData = data.data?.date?.hijri;
      const gregorianData = data.data?.date?.gregorian;

      const formatHijri = hijriData
        ? `${hijriData.day} ${hijriData.month?.en} ${hijriData.year} H`
        : "";

      return NextResponse.json(
        {
          ok: true,
          locationName: cityParam || (latParam && lngParam ? "Lokasi Anda" : DEFAULT_CITY),
          latitude: validLat,
          longitude: validLng,
          hijri: formatHijri,
          date: gregorianData?.date || today.toLocaleDateString("id-ID"),
          timings: {
            Imsak: timings?.Imsak?.slice(0, 5) || "04:15",
            Subuh: timings?.Fajr?.slice(0, 5) || "04:25",
            Terbit: timings?.Sunrise?.slice(0, 5) || "05:42",
            Dzuhur: timings?.Dhuhr?.slice(0, 5) || "11:44",
            Ashar: timings?.Asr?.slice(0, 5) || "15:04",
            Maghrib: timings?.Maghrib?.slice(0, 5) || "17:41",
            Isya: timings?.Isha?.slice(0, 5) || "18:52",
          },
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        }
      );
    }
  } catch (err) {
    console.error("[jadwal-sholat API fallback]", err);
  }

  // Fallback if API fails: Standard timings for Surakarta / Central Java
  return NextResponse.json({
    ok: true,
    locationName: DEFAULT_CITY,
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LNG,
    hijri: "",
    date: new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    timings: {
      Imsak: "04:15",
      Subuh: "04:25",
      Terbit: "05:42",
      Dzuhur: "11:44",
      Ashar: "15:04",
      Maghrib: "17:41",
      Isya: "18:52",
    },
  });
}
