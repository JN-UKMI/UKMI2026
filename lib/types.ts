export interface MemberCard {
  nama: string;
  fakultas: string;
  angkatan?: string;
  nim?: string;
  foto: string;
  role: string;
}

export interface BidangProgram {
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
  program_kerja: BidangProgram[];
  staff: MemberCard[];
}

export interface HomeContent {
  tagline: string;
  visi: string;
  misi: string;
}

export interface LDF {
  nama: string;
  singkatan: string;
  fakultas: string;
  deskripsi: string;
  instagram: string;
  gambar: string;
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
  misi: string;
  tujuan: string[];
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
}

export interface ArticleListItem {
  title: string;
  slug: string;
  excerpt: string;
  category: "Kegiatan" | "Kajian" | "Isu";
  publishedAt: string;
  coverImage?: any;
  author?: string;
}

export interface Article extends ArticleListItem {
  content?: any;
  tags?: string[];
  featured?: boolean;
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
