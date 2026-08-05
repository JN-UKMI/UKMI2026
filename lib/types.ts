import type { SanityImageSource } from "@sanity/image-url";

export interface MemberCard {
  nama: string;
  fakultas: string;
  angkatan?: string;
  nim?: string;
  foto: string;
  role: string;
  jenis_kelamin?: "laki-laki" | "perempuan" | (string & {});
}

export interface BidangProgram {
  title: string;
  description: string;
  tanggal?: string;
  target?: string;
}

export interface TentangCard {
  icon: string;
  title: string;
  description: string;
}

export interface Bidang {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  deskripsi?: string;
  instagram: string;
  instagram_url?: string;
  program_kerja: BidangProgram[];
  staff: MemberCard[];
  tentang_cards?: TentangCard[];
}

export interface HomeContent {
  tagline: string;
  visi: string;
  misi: string;
}

export interface LDF {
  nama: string;
  singkatan?: string;
  fakultas?: string;
  deskripsi: string;
  instagram?: string;
  instagram_url?: string;
  gambar: string;
  contact_person?: string;
  whatsapp?: string;
}

export interface ContactInfo {
  alamat: string;
  email: string;
  instagram: string;
  youtube: string;
  whatsapp: string;
}

export interface Milestone {
  tahun: string;
  judul: string;
  deskripsi: string;
}

export interface AboutContent {
  tagline: string;
  visi: string;
  misi: string[];
  deskripsi: string;
  deskripsi_perkenalan: string[];
  nilai: Array<{ title: string; description: string }>;
  timeline: Milestone[];
}

export interface KabinetContent {
  filosofi_logo: string;
  pengurus: MemberCard[];
}

export interface DoaItem {
  id?: string;
  judul?: string;
  kategori?: string;
  fadhilah?: string;
  arabic: string;
  latin: string;
  terjemahan: string;
}

export interface DoaHarianContent {
  pagi: DoaItem[];
  sore: DoaItem[];
}

export interface Quote {
  arabic: string;
  translation: string;
  source: string;
  type: "ayat" | "hadis";
}

export interface EventItem {
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  isPuasa?: boolean;
}

export interface KegiatanSeruItem {
  id: string;
  title: string;
  date: string;
  dayBadge: string;
  monthBadge: string;
  location: string;
  description: string;
  posterUrl: string;
  instagramUrl: string;
  createdAt: string;
}

export interface PortableTextBlock {
  _type: string;
  _key?: string;
  style?: string;
  children?: Array<{
    _type: string;
    text?: string;
    marks?: (string | Record<string, unknown>)[];
  }>;
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
  listItem?: string;
  level?: number;
}

export interface ArticleListItem {
  title: string;
  slug: string;
  excerpt: string;
  category: "Artikel Islami" | "Kajian Islami" | "Lainnya";
  publishedAt: string;
  coverImage?: SanityImageSource | string;
  author?: string;
}

export interface Article extends ArticleListItem {
  content?: PortableTextBlock[];
  tags?: string[];
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoNoIndex?: boolean;
}

export interface BukuUkmiContent {
  program_name: string;
  tagline: string;
  description: string;
  links: {
    daftar_buku: string;
    peminjaman: string;
    pengembalian: string;
    jariyah_bumi: string;
    lokasi_maps: string;
  };
  jariyah_options: Array<{
    title: string;
    subtitle: string;
    description: string;
  }>;
  narahubung: Array<{
    nama: string;
    whatsapp: string;
    number: string;
  }>;
  quote: {
    text: string;
    author: string;
  };
}

export interface TestimonialItem {
  id: string;
  nama: string;
  periode: string;
  kabinet?: string;
  foto?: string;
  testimoni: string;
}

export interface AlKahfiAyat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
}

export interface AlKahfiSurah {
  nomor: number;
  namaLatin: string;
  arti: string;
  tempatTurun: string;
  jumlahAyat: number;
  ayat: AlKahfiAyat[];
}

export interface UkmiStoreItem {
  name: string;
  price: string;
  price_detail: string;
  unit: string;
  category: string;
  icon: string;
}

export interface UkmiStoreContact {
  role?: string;
  name: string;
  phone: string;
  avatar?: string;
  whatsapp: string;
}

export interface UkmiStoreGuidelineRule {
  title: string;
  detail: string;
}

export interface UkmiStoreGuidelineProcedure {
  step: string;
  detail: string;
}

export interface UkmiStoreGuideline {
  title: string;
  description: string;
  rules: UkmiStoreGuidelineRule[];
  procedures: UkmiStoreGuidelineProcedure[];
}

export interface UkmiStoreContent {
  title: string;
  tagline: string;
  description: string;
  guideline_link: string;
  items: UkmiStoreItem[];
  guideline?: UkmiStoreGuideline;
  contacts: UkmiStoreContact[];
}

export interface MediaSpaceItem {
  id: string;
  title: string;
  description: string;
  instagramUrl: string;
  imageUrl: string;
  createdAt: string;
}

