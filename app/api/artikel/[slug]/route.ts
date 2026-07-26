import { NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/sanity";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { message: "Slug artikel diperlukan" },
        { status: 400 }
      );
    }

    const article = await getArticleBySlug(slug);

    if (!article) {
      return NextResponse.json(
        { message: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(article, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching article:", err);
    return NextResponse.json(
      { message: `Gagal memuat artikel: ${err.message}` },
      { status: 500 }
    );
  }
}
