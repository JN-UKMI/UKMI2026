// Type definitions for JN UKMI website

export interface MemberCard {
  nama: string;
  fakultas: string;
  angkatan: string;
  foto: string;
  role: string;
}

export interface Article {
  title: string;
  slug: string;
  category: "Kegiatan" | "Kajian" | "Isu";
  coverImage: string;
  excerpt: string;
  content: any;
  publishedAt: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
}

export interface Bidang {
  name: string;
  slug: string;
  deskripsi: string;
  instagram_url: string;
  program_kerja: Array<{
    title: string;
    description: string;
  }>;
  staff: MemberCard[];
}

export interface LDF {
  nama: string;
  deskripsi: string;
  instagram_url: string;
  gambar: string;
  contact_person: string;
  whatsapp: string;
}

export interface Timeline {
  year: string;
  description: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  map_embed_url: string;
}

export interface HomeContent {
  tagline: string;
  deskripsi: string;
}

export interface AboutContent {
  visi: string;
  misi: string;
  tujuan: string[];
  timeline: Timeline[];
}

export interface KabinetContent {
  filosofi_logo: string;
  pengurus: MemberCard[];
}

export interface DoaItem {
  arabic: string;
  latin: string;
  terjemahan: string;
}

export interface DoaHarianContent {
  pagi: DoaItem[];
  sore: DoaItem[];
}
