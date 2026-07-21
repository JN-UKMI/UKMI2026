import { promises as fs } from "fs";
import path from "path";
import type {
  HomeContent,
  AboutContent,
  KabinetContent,
  Bidang,
  LDF,
  ContactInfo,
  DoaHarianContent,
  DoaItem,
  Quote,
  EventItem,
  BukuUkmiContent,
} from "./types";

const contentDir = path.join(process.cwd(), "content");

async function safeReadFile(newPath: string, fallbackPath: string): Promise<string> {
  try {
    return await fs.readFile(newPath, "utf-8");
  } catch {
    return await fs.readFile(fallbackPath, "utf-8");
  }
}

export async function loadHome(): Promise<HomeContent> {
  const file = await safeReadFile(
    path.join(contentDir, "beranda", "main.json"),
    path.join(contentDir, "home.json")
  );
  return JSON.parse(file);
}

export async function loadAbout(): Promise<AboutContent> {
  const file = await safeReadFile(
    path.join(contentDir, "tentang", "main.json"),
    path.join(contentDir, "about.json")
  );
  return JSON.parse(file);
}

export async function loadKabinet(): Promise<KabinetContent> {
  const file = await safeReadFile(
    path.join(contentDir, "kabinet", "main.json"),
    path.join(contentDir, "kabinet.json")
  );
  return JSON.parse(file);
}

export async function loadBidang(slug: string): Promise<Bidang> {
  const file = await fs.readFile(
    path.join(contentDir, "bidang", `${slug}.json`),
    "utf-8"
  );
  return JSON.parse(file);
}

export async function loadLDF(): Promise<LDF[]> {
  const file = await safeReadFile(
    path.join(contentDir, "ldf", "main.json"),
    path.join(contentDir, "ldf.json")
  );
  return JSON.parse(file);
}

export async function loadContact(): Promise<ContactInfo> {
  const file = await safeReadFile(
    path.join(contentDir, "kontak", "main.json"),
    path.join(contentDir, "contact.json")
  );
  return JSON.parse(file);
}

export async function loadDoaHarian(): Promise<DoaHarianContent> {
  const file = await safeReadFile(
    path.join(contentDir, "doa-harian", "main.json"),
    path.join(contentDir, "doa-harian.json")
  );
  return JSON.parse(file);
}

export async function loadDoaDoa(): Promise<DoaItem[]> {
  const file = await safeReadFile(
    path.join(contentDir, "doa-harian", "doa-doa.json"),
    path.join(contentDir, "doa-doa.json")
  );
  return JSON.parse(file);
}

export async function loadQuotes(): Promise<Quote[]> {
  const file = await safeReadFile(
    path.join(contentDir, "beranda", "quotes.json"),
    path.join(contentDir, "quotes.json")
  );
  return JSON.parse(file);
}

export async function loadEvents(): Promise<{
  events: EventItem[];
  monthly_quotes?: Record<string, { text: string; source: string }>;
}> {
  const file = await safeReadFile(
    path.join(contentDir, "beranda", "events.json"),
    path.join(contentDir, "events.json")
  );
  return JSON.parse(file);
}

export async function loadBukuUkmi(): Promise<BukuUkmiContent> {
  const file = await safeReadFile(
    path.join(contentDir, "buku-ukmi", "main.json"),
    path.join(contentDir, "buku-ukmi.json")
  );
  return JSON.parse(file);
}
