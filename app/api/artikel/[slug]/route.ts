import { NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/sanity";
import { apiBadRequest, apiServerError, apiNotFound } from "@/lib/api-response";

// Slug harus merupakan karakter aman dan pendek untuk mencegah
// overlong-parameter DOS pada downstream GROQ query.
const SLUG_REGEX = /^[a-z0-9][a-z0-9\-]{0,119}$/;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug || !SLUG_REGEX.test(slug)) {
      return apiBadRequest("Slug artikel tidak valid.");
    }

    const article = await getArticleBySlug(slug);

    if (!article) {
      return apiNotFound("Artikel tidak ditemukan.");
    }

    return NextResponse.json(article, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching article:", err);
    return apiServerError("Gagal memuat artikel: " + (err?.message ?? "unknown"));
  }
}
