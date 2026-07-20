import type { Metadata } from "next";
import { getArticles, getArticleBySlug, urlFor } from "@/lib/sanity";
import { ArticleBody } from "@/components/article/ArticleBody";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag, Pencil } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const categoryColors: Record<string, string> = {
  Kegiatan: "bg-lime/10 text-lime",
  Kajian: "bg-teal/10 text-teal",
  Isu: "bg-sage/10 text-sage",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dummy articles list with PortableText body contents
const dummyArticlesDetail = [
  {
    title: "[Kajian] Membangun Karakter Pemuda Muslim di Era Milenial",
    slug: "membangun-karakter-pemuda-muslim",
    excerpt: "Rangkuman kajian pekanan mengenai pilar-pilar karakter yang harus dimiliki pemuda Muslim untuk menghadapi tantangan zaman agar tetap istiqomah di tengah arus modernisasi global.",
    publishedAt: new Date().toISOString(),
    category: "Kajian",
    author: "Humas JN UKMI",
    coverImage: "/placeholder.png",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Pemuda Muslim di era milenial saat ini menghadapi tantangan yang sangat besar, baik dari segi pemikiran, gaya hidup, maupun arus digitalisasi global yang masif. Membangun fondasi spiritual yang kokoh adalah langkah pertama yang tidak dapat ditawar." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Tiga Pilar Karakter Utama" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Untuk teguh berdiri di atas nilai-nilai Islam, pemuda perlu memiliki tiga karakteristik fundamental:" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "1. Salimul Aqidah (Aqidah yang bersih) - Keyakinan mutlak kepada Allah tanpa syirik." }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "2. Shahihul Ibadah (Ibadah yang benar) - Melaksanakan syariat sesuai ajaran Nabi Muhammad SAW." }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "3. Matinul Khuluq (Akhlak yang kokoh) - Berperilaku terpuji kepada sesama makhluk hidup." }]
      }
    ]
  },
  {
    title: "[Kegiatan] Dokumentasi Rapat Kerja Kabinet Iskandar Muda",
    slug: "dokumentasi-raker-iskandar-muda",
    excerpt: "Laporan pelaksanaan rapat kerja kepengurusan JN UKMI untuk merumuskan program dakwah strategis selama satu periode ke depan, menyelaraskan visi misi bersama seluruh pengurus.",
    publishedAt: new Date().toISOString(),
    category: "Kegiatan",
    author: "Sekretariat",
    coverImage: "/placeholder.png",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "JN UKMI UNS Periode Kabinet Iskandar Muda telah sukses menyelenggarakan Rapat Kerja (Raker) perdana. Rapat ini dihadiri oleh jajaran BPH, pengurus harian, serta perwakilan pengurus bidang." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Fokus Program Kerja Strategis" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Melalui diskusi intensif antar-bidang, dihasilkan berbagai usulan program dakwah kreatif berbasis digital serta penguatan pembinaan internal organisasi. Hal ini ditujukan agar syiar islam di lingkungan universitas dapat tersampaikan secara harmonis, modern, dan inklusif." }]
      }
    ]
  },
  {
    title: "[Isu] Peran Strategis Aktivis Dakwah Kampus di Universitas Sebelas Maret",
    slug: "peran-strategis-dakwah-campurs",
    excerpt: "Opini mengenai kontribusi nyata yang dapat diberikan mahasiswa Muslim terhadap dinamika sosial-kemasyarakatan di kampus serta pentingnya dakwah yang santun dan inklusif.",
    publishedAt: new Date().toISOString(),
    category: "Isu",
    author: "Kastrat JN UKMI",
    coverImage: "/placeholder.png",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Aktivis dakwah kampus bukan hanya sekadar penyelenggara acara kajian keagamaan, melainkan pilar perubahan sosial yang berperan aktif menyebarkan pesan kedamaian, toleransi, and nilai luhur islami di dalam kampus." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Dakwah Kreatif dan Inovatif" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Melihat dinamika kampus masa kini, penyampaian dakwah perlu disesuaikan dengan tren mahasiswa terkini, salah satunya dengan pemanfaatan media seni, teknologi, and riset ilmiah secara terukur." }]
      }
    ]
  },
  {
    title: "[Kajian] Tafsir Al-Quran Aktual: Surah Al-Kahfi di Tengah Fitnah Akhir Zaman",
    slug: "tafsir-al-kahfi-akhir-zaman",
    excerpt: "Ulasan mendalam mengenai pelajaran berharga dari kisah-kisah Surah Al-Kahfi serta tips praktis membentengi diri dari pengaruh negatif moral di masa sekarang.",
    publishedAt: new Date().toISOString(),
    category: "Kajian",
    author: "Kaderisasi",
    coverImage: "/placeholder.png",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Membaca Surah Al-Kahfi di hari Jumat bukan sekadar ritual mingguan tanpa makna. Di dalam surah mulia ini, Allah SWT menyisipkan empat buah kisah luar biasa yang sarat akan pelajaran hidup tentang fitnah keyakinan, harta, ilmu, dan kekuasaan." }]
      }
    ]
  },
  {
    title: "[Kegiatan] Semarak Ramadhan Kampus: Tebar Takjil & Ifthar Jam'i",
    slug: "semarak-ramadhan-ifthar-jami",
    excerpt: "Dokumentasi kebersamaan pengurus JN UKMI dalam berbagi keberkahan Ramadhan dengan pembagian makanan berbuka puasa gratis bagi civitas akademika UNS.",
    publishedAt: new Date().toISOString(),
    category: "Kegiatan",
    author: "Syiar",
    coverImage: "/placeholder.png",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Dalam menyambut kemuliaan bulan suci Ramadhan, bidang Syiar JN UKMI mengadakan rangkaian pembagian takjil gratis bagi mahasiswa UNS di sekitar gerbang utama kampus." }]
      }
    ]
  },
  {
    title: "[Isu] Menatap Masa Depan Dakwah Kampus Melalui Media Kreatif",
    slug: "masa-depan-dakwah-media-kreatif",
    excerpt: "Analisis peluang dan tantangan penyampaian pesan-pesan moral keislaman melalui infografis, video pendek, dan konten audio di kalangan mahasiswa saat ini.",
    publishedAt: new Date().toISOString(),
    category: "Isu",
    author: "Media",
    coverImage: "/placeholder.png",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Di era digital saat ini, platform video pendek dan konten visual yang menarik merupakan ujung tombak syiar dakwah. Konten islami harus dikemas secara estetis dan ringkas agar mampu bersaing dengan arus hiburan masa kini." }]
      }
    ]
  },
  {
    title: "[Kajian] Pentingnya Menjaga Ukhuwah Islamiyah di Lingkungan Kampus",
    slug: "menjaga-ukhuwah-islamiyah-kampus",
    excerpt: "Pembahasan mendalam tentang esensi persaudaraan sesama Muslim serta langkah konkret meminimalkan gesekan pendapat di era informasi digital.",
    publishedAt: new Date().toISOString(),
    category: "Kajian",
    author: "Internal",
    coverImage: "/placeholder.png",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Menjaga persatuan dan ikatan ukhuwah (persaudaraan) antar mahasiswa Muslim di lingkungan universitas adalah kunci sukses tegaknya dakwah syiar islam. Perbedaan pemikiran fikih atau golongan semestinya tidak memecah belah kekuatan dakwah bersama." }]
      }
    ]
  },
  {
    title: "[Kegiatan] Bakti Sosial Akbar JN UKMI di Desa Mitra Karanganyar",
    slug: "bakti-sosial-karanganyar",
    excerpt: "Catatan pengabdian masyarakat berupa pemeriksaan kesehatan gratis dan pembagian sembako yang diinisiasi oleh Bidang Eksternal JN UKMI.",
    publishedAt: new Date().toISOString(),
    category: "Kegiatan",
    author: "Eksternal",
    coverImage: "/placeholder.png",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Pengabdian kepada masyarakat luar merupakan wujud nyata Tridharma Perguruan Tinggi. Bidang Eksternal JN UKMI bekerja sama dengan tim medis menyelenggarakan pemeriksaan kesehatan gratis serta santunan anak yatim di Karanganyar." }]
      }
    ]
  }
];

export async function generateStaticParams() {
  let articles: any[] = [];
  try {
    articles = await getArticles();
  } catch {}

  if (articles.length === 0) {
    articles = dummyArticlesDetail;
  }

  return articles.map((article: { slug: string }) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let article: any = null;
  try {
    article = await getArticleBySlug(slug);
  } catch {}

  if (!article) {
    article = dummyArticlesDetail.find((a) => a.slug === slug);
  }

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
    };
  }

  return {
    title: `${article.title} - JN UKMI`,
    description: article.excerpt,
  };
}

export default async function ArtikelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let article: any = null;
  try {
    article = await getArticleBySlug(slug);
  } catch {}

  // Fallback to local dummy article if not found in Sanity database
  if (!article) {
    article = dummyArticlesDetail.find((a) => a.slug === slug);
  }

  if (!article) {
    notFound();
  }

  // Safe helper to resolve cover image URL
  const getCoverImageUrl = () => {
    if (!article.coverImage) return "/placeholder.png";
    try {
      if (typeof article.coverImage === "object" && article.coverImage.asset) {
        return urlFor(article.coverImage).url();
      }
      if (typeof article.coverImage === "string") {
        return article.coverImage;
      }
    } catch {
      return "/placeholder.png";
    }
    return "/placeholder.png";
  };

  return (
    <div className="bg-white">
      <article>
        {/* Cover Image */}
        <div className="relative h-[250px] md:h-[450px] w-full overflow-hidden">
          <Image
            src={getCoverImageUrl()}
            alt={article.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Back Button */}
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-forest-600 transition-colors mb-8 cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Artikel
          </Link>

          {/* Meta Info */}
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-forest-50 border border-forest-150 rounded-full text-xs font-bold text-forest-600 mb-4 w-fit">
              <Tag className="w-3.5 h-3.5" />
              <span>{article.category}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400">
              {article.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-forest-600" />
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              )}
              {article.author && (
                <div className="flex items-center gap-1.5">
                  <Pencil className="w-3.5 h-3.5 text-forest-600" />
                  <span>oleh {article.author}</span>
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-forest prose-lg max-w-none mb-12">
            <ArticleBody content={article.content} />
          </div>
        </div>
      </article>
    </div>
  );
}