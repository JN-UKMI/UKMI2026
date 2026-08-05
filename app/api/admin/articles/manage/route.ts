import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { requireAdmin } from "@/lib/auth";
import {
  apiOk,
  apiBadRequest,
  apiUnauthorized,
  apiServerError,
  apiNotFound,
  apiServiceUnavailable,
} from "@/lib/api-response";
import {
  ManageGetQuerySchema,
  ArticleUpdateSchema,
  ArticleDeleteSchema,
} from "@/lib/schemas";
import { sanitizeArticleContent } from "@/lib/sanitize-content";

function getWriteClient(token: string) {
  return createClient({
    projectId: "ksc63oa8",
    dataset: "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });
}

// ── GET: fetch single article by Sanity ID (admin gated) ─────────
export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiUnauthorized();

  const { searchParams } = new URL(request.url);
  const parsed = ManageGetQuerySchema.safeParse({
    id: searchParams.get("id"),
  });
  if (!parsed.success) return apiBadRequest("ID artikel tidak valid.");

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    return apiServiceUnavailable("SANITY_WRITE_TOKEN belum dikonfigurasi.");
  }

  try {
    const writeClient = getWriteClient(token);
    const article = await writeClient.fetch(
      `*[_type == "article" && _id == $id][0] {
        _id,
        title,
        "slug": slug.current,
        category,
        excerpt,
        content,
        coverImage,
        publishedAt,
        author
      }`,
      { id: parsed.data.id }
    );
    if (!article) return apiNotFound("Artikel tidak ditemukan.");
    return NextResponse.json({ article });
  } catch (err: any) {
    return apiServerError("Gagal mengambil artikel: " + (err?.message ?? "unknown"));
  }
}

// ── PUT: update article (admin gated) ────────────────────────────
export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiUnauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiBadRequest("Body bukan JSON valid.");
  }

  const parsed = ArticleUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiBadRequest(
      "Validasi gagal: " + parsed.error.issues.map((i) => i.message).join("; ")
    );
  }
  const { id, title, category, excerpt, content, author, publishedAt, coverImage } = parsed.data;

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    return apiServiceUnavailable("SANITY_WRITE_TOKEN belum dikonfigurasi.");
  }

  try {
    const writeClient = getWriteClient(token);
    const patchData: Record<string, unknown> = {
      title,
      category,
      excerpt,
      content: sanitizeArticleContent(content),
    };
    if (author !== undefined) patchData.author = author;
    if (publishedAt !== undefined) patchData.publishedAt = publishedAt;

    // Sanitize / structure coverImage input.
    if (coverImage !== undefined) {
      if (coverImage === null) {
        patchData.coverImage = null;
      } else if (typeof coverImage === "object" && "assetId" in coverImage) {
        patchData.coverImage = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: coverImage.assetId,
          },
        };
      } else if (typeof coverImage === "string") {
        const trimmed = coverImage.trim();
        if (trimmed.startsWith("data:image/") || /^https?:\/\//.test(trimmed)) {
          patchData.coverImage = trimmed;
        } else {
          return apiBadRequest("Format coverImage tidak valid.");
        }
      } else {
        return apiBadRequest("Format coverImage tidak dikenal.");
      }
    }

    // FIX: actually dispatch the patch to Sanity.
    await writeClient.patch(id).set(patchData).commit();
    return apiOk("Artikel berhasil diperbarui.");
  } catch (err: any) {
    return apiServerError("Gagal memperbarui artikel: " + (err?.message ?? "unknown"));
  }
}

// ── DELETE: delete article (admin gated) ─────────────────────────
export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiUnauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiBadRequest("Body bukan JSON valid.");
  }

  const parsed = ArticleDeleteSchema.safeParse(body);
  if (!parsed.success) return apiBadRequest("ID artikel tidak valid.");

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    return apiServiceUnavailable("SANITY_WRITE_TOKEN belum dikonfigurasi.");
  }

  try {
    const writeClient = getWriteClient(token);
    await writeClient.delete(parsed.data.id);
    return apiOk("Artikel berhasil dihapus.");
  } catch (err: any) {
    return apiServerError("Gagal menghapus artikel: " + (err?.message ?? "unknown"));
  }
}
