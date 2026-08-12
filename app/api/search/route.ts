import { NextResponse } from "next/server";
import { getArticles } from "@/lib/sanity";
import { loadDoaDoa, loadKegiatanSeru, loadEvents } from "@/lib/content";

export const revalidate = 3600; // index ringan, cache 1 jam

interface SearchEntry {
  type: "artikel" | "doa" | "kegiatan";
  title: string;
  subtitle?: string;
  url: string;
  keywords?: string;
}

export async function GET() {
  const entries: SearchEntry[] = [];

  // Artikel (Sanity) — bungkus try/catch agar index tetap hidup saat Sanity down.
  try {
    const articles = await getArticles();
    // Batasi index agar payload ringan (artikel terbanyak tetap terindeks).
    for (const a of articles.slice(0, 100)) {
      if (!a.title || !a.slug) continue;
      entries.push({
        type: "artikel",
        title: a.title,
        subtitle: a.category || "Artikel",
        url: `/artikel/${a.slug}`,
        keywords: [a.excerpt, a.author].filter(Boolean).join(" "),
      });
    }
  } catch {
    // Sanity tidak tersedia — index tanpa artikel.
  }

  // Doa harian
  try {
    const doas = await loadDoaDoa();
    for (const d of doas) {
      const judul = d.judul || d.latin || "";
      if (!judul) continue;
      entries.push({
        type: "doa",
        title: judul,
        subtitle: d.kategori || "Doa Harian",
        url: "/doa-doa",
        keywords: `${d.arabic} ${d.latin} ${d.terjemahan}`,
      });
    }
  } catch {
    // fallback JSON gagal dibaca — lewati.
  }

  // Kegiatan seru (event terdekat)
  try {
    const kegiatan = await loadKegiatanSeru();
    for (const k of kegiatan) {
      entries.push({
        type: "kegiatan",
        title: k.title,
        subtitle: k.location || "Kegiatan JN UKMI",
        url: "/",
        keywords: `${k.date} ${k.description}`,
      });
    }
  } catch {
    // lewati
  }

  // Agenda bulanan (kalender beranda)
  try {
    const { events } = await loadEvents();
    for (const e of events) {
      entries.push({
        type: "kegiatan",
        title: e.title,
        subtitle: `${e.type} — ${e.location}`,
        url: "/",
        keywords: `${e.date} ${e.time}`,
      });
    }
  } catch {
    // lewati
  }

  return NextResponse.json({ ok: true, entries });
}
