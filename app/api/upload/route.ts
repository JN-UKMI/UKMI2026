import { createClient } from "next-sanity";
import { randomUUID } from "node:crypto";
import { authorizeAdminOrPasscode } from "@/lib/api-auth";
import {
  apiOk,
  apiBadRequest,
  apiServerError,
  apiServiceUnavailable,
  apiUnauthorized,
} from "@/lib/api-response";
import { ContentType, ALLOWED_IMAGE_MIME_TYPES } from "@/lib/schemas";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

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
    projectId: "ksc63oa8",
    dataset: "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return apiBadRequest("Body bukan form-data valid.");
  }

  const file = formData.get("file");
  const providedPasscode = formData.get("passcode");
  const passcodeStr =
    typeof providedPasscode === "string" ? providedPasscode : null;

  const auth = await authorizeAdminOrPasscode(request, passcodeStr);
  if (!auth.authorized) {
    if (auth.reason === "not_configured") {
      return apiServiceUnavailable(
        "Login admin atau kode akses pengurus belum dikonfigurasi di server."
      );
    }
    return apiUnauthorized(
      "Akses ditolak. Login sebagai admin atau gunakan kode akses pengurus."
    );
  }

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

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    // Fallback: base64 data URL for local dev. Embed only the validated MIME.
    const base64 = buffer.toString("base64");
    return apiOk("Unggah lokal (tanpa Sanity).", {
      url: `data:${file.type};base64,${base64}`,
    });
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
