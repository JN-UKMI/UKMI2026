import { createClient } from "next-sanity";
import { randomUUID } from "node:crypto";
import {
  apiOk,
  apiBadRequest,
  apiServerError,
  apiRateLimited,
  apiServiceUnavailable,
} from "@/lib/api-response";
import { ContentType, ALLOWED_IMAGE_MIME_TYPES } from "@/lib/schemas";
import { getClientIp, checkRateLimit, recordAttempt } from "@/lib/api-auth";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_UPLOADS_PER_MINUTE = 10;
const UPLOAD_WINDOW_MS = 60 * 1000;

function extFromMime(mime: string): string {
  switch (mime) {
    case ContentType.png:
      return ".png";
    case ContentType.webp:
      return ".webp";
    case ContentType.gif:
      return ".gif";
    case ContentType.jpg:
    case ContentType.jpeg:
    default:
      return ".jpg";
  }
}

// Sanitize filename: strip path components, control characters, and inject a
// random suffix so collisions are unlikely even if attacker guesses the base.
function sanitizeFilename(originalName: string, mime: string): string {
  const trimmed = String(originalName || "upload")
    .replace(/[\\/]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 60);
  const base = trimmed.split(".")[0] || "upload";
  return `${base}-${randomUUID().slice(0, 8)}${extFromMime(mime)}`;
}

function getWriteClient(token: string) {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ksc63oa8",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimitKey = `image-upload:${ip}`;

  const currentLimit = checkRateLimit(rateLimitKey);
  if (currentLimit.blocked) {
    return apiRateLimited(
      "Terlalu banyak permintaan unggah gambar. Silakan tunggu 1 menit.",
      60
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return apiBadRequest("Body bukan form-data valid.");
  }

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return apiBadRequest("Tidak ada file yang disertakan.");
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    return apiBadRequest(
      "Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF."
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return apiBadRequest("Ukuran file maksimal 5MB.");
  }

  const rateResult = recordAttempt(
    rateLimitKey,
    MAX_UPLOADS_PER_MINUTE,
    UPLOAD_WINDOW_MS,
    UPLOAD_WINDOW_MS
  );
  if (rateResult.blocked) {
    return apiRateLimited(
      "Batas unggah gambar per menit tercapai (maksimal 10 gambar/menit). Silakan tunggu sebentar.",
      60
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    return apiServiceUnavailable("SANITY_WRITE_TOKEN belum dikonfigurasi.");
  }

  try {
    const client = getWriteClient(token);
    const asset = await client.assets.upload("image", buffer, {
      filename: sanitizeFilename(file.name, file.type),
      contentType: file.type,
    });
    return apiOk("Gambar berhasil diunggah.", {
      url: asset.url,
      assetId: asset._id,
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    return apiServerError("Gagal mengunggah gambar.");
  }
}
