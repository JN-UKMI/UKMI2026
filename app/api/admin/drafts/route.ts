import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

// In-memory brute force protection for admin login
const failedAttempts = new Map<string, { count: number; blockedUntil: number }>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "anonymous-ip";
}

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

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const now = Date.now();

  // Rate Limiting Check
  const record = failedAttempts.get(ip);
  if (record && record.blockedUntil > now) {
    const minutesLeft = Math.ceil((record.blockedUntil - now) / 60000);
    return NextResponse.json(
      { message: `Terlalu banyak percobaan login salah. Akses diblokir selama ${minutesLeft} menit.` },
      { status: 429 }
    );
  }

  try {
    const { passcode } = await request.json();

    const expectedPasscode = process.env.KODE_AKSES_ADMIN || process.env.KODE_AKSES_PENGURUS || "UKMI2026";
    if (passcode !== expectedPasscode) {
      const newAttempts = (record?.count || 0) + 1;
      if (newAttempts >= 5) {
        failedAttempts.set(ip, { count: newAttempts, blockedUntil: now + 15 * 60 * 1000 });
        return NextResponse.json(
          { message: "Sandi Admin salah 5 kali. Akses Anda diblokir sementara selama 15 menit." },
          { status: 429 }
        );
      } else {
        failedAttempts.set(ip, { count: newAttempts, blockedUntil: 0 });
        return NextResponse.json(
          { message: `Kode Akses Admin salah. Sisa percobaan: ${5 - newAttempts}` },
          { status: 401 }
        );
      }
    }

    // Passcode correct, reset failures
    failedAttempts.delete(ip);

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
