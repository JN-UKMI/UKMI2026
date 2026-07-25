import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { requireAdmin } from "@/lib/auth";

const mockDrafts = [
  {
    _id: "drafts.kajian-aqidah-remaja-1234",
    title: "[Kajian] Pentingnya Aqidah Kokoh bagi Remaja Masjid",
    slug: "kajian-aqidah-remaja",
    excerpt: "Draf kajian mengenai tantangan pemikiran modern and cara membentengi akidah para remaja di lingkungan pengurus masjid.",
    content: "Aqidah merupakan pondasi dasar yang menopang seluruh keislaman seseorang. Di era modern, tantangan pemikiran baik dari materialisme, sekularisme, hingga tren digital yang instan membutuhkan benteng iman yang tangguh bagi para pemuda Muslim khususnya remaja masjid. Pembinaan berkala melalui kajian-kajian terstruktur menjadi salah satu solusi kunci.",
    category: "Kajian",
    author: "Kaderisasi",
    publishedAt: new Date().toISOString(),
  },
  {
    _id: "drafts.bantuan-kemanusiaan-bencana-5678",
    title: "[Kegiatan] Aksi Cepat Tanggap JN UKMI Peduli Bencana Banjir",
    slug: "aksi-peduli-bencana-banjir",
    excerpt: "Laporan penyaluran logistik makanan dan bantuan pakaian layak pakai bagi korban banjir bandang di Solo Raya.",
    content: "Musibah banjir bandang melanda sebagian besar wilayah Solo Raya menyisakan duka mendalam. Merespon kondisi tersebut, bidang Eksternal JN UKMI menyelenggarakan penggalangan bantuan logistik makanan, pakaian layak, dan obat-obatan. Tim relawan terjun langsung ke posko pengungsian untuk mendistribusikan bantuan secara tertib dan adil.",
    category: "Kegiatan",
    author: "Eksternal",
    publishedAt: new Date().toISOString(),
  }
];

export async function GET() {
  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ message: "Akses ditolak. Sesi admin tidak valid." }, { status: 403 });
  }

  try {
    const token = process.env.SANITY_WRITE_TOKEN;
    if (!token) {
      // Graceful fallback to mock data if Sanity token is missing
      return NextResponse.json({ drafts: mockDrafts, fallback: true });
    }

    const writeClient = createClient({
      projectId: "ksc63oa8",
      dataset: "production",
      apiVersion: "2024-01-01",
      token: token,
      useCdn: false,
    });

    // Fetch all draft articles (Sanity IDs starting with drafts.)
    const drafts = await writeClient.fetch(
      `*[_type == "article" && _id in path("drafts.**")] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        category,
        excerpt,
        content,
        publishedAt,
        author
      }`
    );

    return NextResponse.json({ drafts, fallback: false });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Gagal membaca antrean moderasi: ${err.message}` },
      { status: 500 }
    );
  }
}
