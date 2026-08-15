import { createClient } from "next-sanity";
import { sanitizeArticleContent } from "@/lib/sanitize-content";
import {
  apiCreated,
  apiBadRequest,
  apiServerError,
  apiRateLimited,
  apiServiceUnavailable,
} from "@/lib/api-response";
import {
  ArticleCreateSchema,
  ALLOWED_IMAGE_MIME_TYPES,
} from "@/lib/schemas";
import { getClientIp, checkRateLimit, recordAttempt } from "@/lib/api-auth";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_SUBMISSIONS_PER_HOUR = 3;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const WINDOW_DURATION_MS = 60 * 60 * 1000; // 1 hour

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-dan-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function parseImagePayload(imageBase64: string): { mime: string; buffer: Buffer } | null {
  const matches = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) return null;
  const mime = matches[1].toLowerCase();
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(mime)) return null;
  return { mime, buffer: Buffer.from(matches[2], "base64") };
}

interface SanityClient {
  assets: {
    upload: (
      type: "image",
      buffer: Buffer,
      opts: { filename: string; contentType?: string }
    ) => Promise<{ _id: string }>;
  };
  createOrReplace: (doc: unknown) => Promise<{ _id: string }>;
}

function getWriteClient(token: string): SanityClient {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ksc63oa8",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  }) as unknown as SanityClient;
}

// ── POST: submit a new article draft (open for all users with IP rate limiting) ──
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimitKey = `article-create:${ip}`;

  const currentLimit = checkRateLimit(rateLimitKey);
  if (currentLimit.blocked) {
    return apiRateLimited(
      `Batas pengiriman artikel tercapai (${MAX_SUBMISSIONS_PER_HOUR} artikel/jam). Silakan tunggu ${currentLimit.minutesLeft} menit lagi.`,
      currentLimit.minutesLeft * 60
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return apiBadRequest("Body bukan JSON valid.");
  }

  const parsed = ArticleCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return apiBadRequest(
      "Validasi gagal: " + parsed.error.issues.map((i) => i.message).join("; ")
    );
  }

  // Record attempt
  const rateResult = recordAttempt(
    rateLimitKey,
    MAX_SUBMISSIONS_PER_HOUR,
    BLOCK_DURATION_MS,
    WINDOW_DURATION_MS
  );
  if (rateResult.blocked) {
    return apiRateLimited(
      `Batas pengiriman artikel tercapai (${MAX_SUBMISSIONS_PER_HOUR} artikel/jam). Silakan tunggu ${rateResult.minutesLeft} menit lagi.`,
      rateResult.minutesLeft * 60
    );
  }

  // Optional image upload
  let imageAssetRef: { _type: "image"; asset: { _type: "reference"; _ref: string } } | null = null;
  if (parsed.data.imageBase64) {
    const img = parseImagePayload(parsed.data.imageBase64);
    if (!img) {
      return apiBadRequest("Format encoding gambar tidak valid.");
    }
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(img.mime)) {
      return apiBadRequest(
        "Format file tidak diizinkan. Hanya gambar JPG, PNG, GIF, dan WEBP yang diperbolehkan."
      );
    }
    if (img.buffer.length > MAX_IMAGE_BYTES) {
      return apiBadRequest("Ukuran gambar terlalu besar. Maksimal 5MB.");
    }

    const token = process.env.SANITY_WRITE_TOKEN;
    if (!token) {
      return apiServiceUnavailable("SANITY_WRITE_TOKEN belum dikonfigurasi.");
    }
    try {
      const writeClient = getWriteClient(token);
      const uploaded = await writeClient.assets.upload("image", img.buffer, {
        filename: parsed.data.imageName || "uploaded-cover.jpg",
        contentType: img.mime,
      });
      imageAssetRef = {
        _type: "image",
        asset: { _type: "reference", _ref: uploaded._id },
      };
    } catch (err) {
      console.error("Gagal mengunggah gambar ke Sanity CDN:", err);
      return apiServerError("Gagal mengunggah gambar sampul.");
    }
  }

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    return apiServiceUnavailable(
      "Fitur tulis artikel dinonaktifkan sementara karena server belum mengonfigurasi SANITY_WRITE_TOKEN."
    );
  }
  const writeClient = getWriteClient(token);

  const slug = `${slugify(parsed.data.title)}-${Date.now().toString().slice(-4)}`;
  const cleanContent = sanitizeArticleContent(parsed.data.content);

  const document = {
    _type: "article",
    _id: `drafts.${slug}`,
    title: parsed.data.title,
    slug: { _type: "slug", current: slug },
    category: parsed.data.category,
    excerpt: parsed.data.excerpt,
    author: parsed.data.author,
    publishedAt: parsed.data.publishedAt
      ? new Date(parsed.data.publishedAt).toISOString()
      : new Date().toISOString(),
    featured: false,
    tags: [parsed.data.category.toLowerCase()],
    ...(imageAssetRef ? { coverImage: imageAssetRef } : {}),
    content: cleanContent,
  };

  try {
    const created = await writeClient.createOrReplace(document);
    return apiCreated(
      "Artikel berhasil dikirim ke antrean moderasi.",
      { id: created._id, slug }
    );
  } catch (err) {
    console.error("Sanity post error:", err);
    return apiServerError("Gagal menyimpan artikel ke antrean moderasi.");
  }
}
