import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ message: "Akses ditolak. Sesi admin tidak valid." }, { status: 403 });
  }

  try {
    const token = process.env.SANITY_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { message: "SANITY_WRITE_TOKEN belum dikonfigurasi." },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
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
        author,
        coverImage
      }`
    );

    return NextResponse.json({ drafts }, { headers: { "Cache-Control": "no-store" } });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Gagal membaca antrean moderasi: ${err.message}` },
      { status: 500 }
    );
  }
}
