import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();

    const expectedPasscode = process.env.KODE_AKSES_ADMIN || process.env.KODE_AKSES_PENGURUS || "UKMI2026";
    if (passcode !== expectedPasscode) {
      return NextResponse.json(
        { message: "Kode Akses tidak valid." },
        { status: 401 }
      );
    }

    const token = process.env.SANITY_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ articles: [], fallback: true });
    }

    const writeClient = createClient({
      projectId: "ksc63oa8",
      dataset: "production",
      apiVersion: "2024-01-01",
      token: token,
      useCdn: false,
    });

    const articles = await writeClient.fetch(
      `*[_type == "article" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
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

    return NextResponse.json({ articles, fallback: false });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Gagal membaca artikel terpublikasi: ${err.message}` },
      { status: 500 }
    );
  }
}
