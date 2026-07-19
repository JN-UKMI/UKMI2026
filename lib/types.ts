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
