import sanitizeHtml from "sanitize-html";
import { createClient } from "next-sanity";
import {
  apiOk,
  apiCreated,
  apiBadRequest,
  apiServerError,
  apiRateLimited,
  apiServiceUnavailable,
  apiUnauthorized,
} from "@/lib/api-response";
import {
  ArticleCreateSchema,
  ArticlePatchSchema,
  ContentType,
} from "@/lib/schemas";
import {
  ALLOWED_IMAGE_MIME_TYPES,
} from "@/lib/schemas";
import {
  checkRateLimit,
  recordFailedAttempt,
  clearAttempts,
  getClientIp,
  verifyPasscode,
  isPasscodeConfigured,
} from "@/lib/api-auth";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

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

function sanitizeContent(input: string): string {
  // Allow formatting tags that the Novel editor commonly emits, but strip
  // event handlers / scripts / unknown protocols as a defence in depth.
  return sanitizeHtml(input, {
    allowedTags: [
      "p", "br", "strong", "em", "b", "i", "u", "a", "ul", "ol", "li",
      "blockquote", "code", "pre", "h1", "h2", "h3", "h4", "img",
      "figure", "figcaption", "span", "div", "hr",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      span: ["class"],
      div: ["class"],
      code: ["class"],
      pre: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "data"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
    disallowedTagsMode: "discard",
  });
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
  patch: (id: string) => { set: (data: Record<string, unknown>) => { commit: () => Promise<unknown> } };
}

function getWriteClient(token: string): SanityClient {
  return createClient({
    projectId: "ksc63oa8",
    dataset: "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  }) as unknown as SanityClient;
}

// ── POST: submit a new article draft ────────────────────────────
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const blocked = checkRateLimit(ip);
  if (blocked.blocked) {
    return apiRateLimited(
      `Terlalu banyak percobaan salah. Akses Anda diblokir sementara selama ${blocked.minutesLeft} menit.`,
      blocked.minutesLeft * 60
    );
  }
  if (!isPasscodeConfigured()) {
    return apiServiceUnavailable(
      "Fitur tulis artikel dinonaktifkan sementara karena KODE_AKSES_PENGURUS belum dikonfigurasi."
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

  if (!verifyPasscode(parsed.data.passcode)) {
    const after = recordFailedAttempt(ip);
    if (after.blocked) {
      return apiRateLimited(
        "Kode Akses salah 5 kali berturut-turut. Akses Anda diblokir sementara selama 15 menit.",
        15 * 60
      );
    }
    return apiUnauthorized(
      `Kode Akses Pengurus tidak valid. Sisa percobaan: ${5 - (after.count ?? 0)}`,
      "AUTH_REQUIRED"
    );
  }
  clearAttempts(ip);

  // Optional image upload
  let imageAssetRef: { _type: "image"; asset: { _type: "reference"; _ref: string } } | null = null;
  if (parsed.data.imageBase64) {
    const img = parseImagePayload(parsed.data.imageBase64);
    if (!img) {
      return apiBadRequest(
        "Format encoding gambar tidak valid."
      );
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
      return apiServiceUnavailable(
        "SANITY_WRITE_TOKEN belum dikonfigurasi."
      );
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

  // Always require Sanity token for actual persistence.
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    return apiServiceUnavailable(
      "Fitur tulis artikel dinonaktifkan sementara karena server belum mengonfigurasi SANITY_WRITE_TOKEN."
    );
  }
  const writeClient = getWriteClient(token);

  const slug = `${slugify(parsed.data.title)}-${Date.now().toString().slice(-4)}`;
  const cleanContent = sanitizeContent(parsed.data.content);

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
      "Artikel dan gambar berhasil dikirim ke moderasi.",
      { id: created._id, slug }
    );
  } catch (err: any) {
    console.error("Sanity post error:", err);
    return apiServerError("Gagal menyimpan ke database Sanity: " + (err?.message ?? "unknown"));
  }
}

// ── PATCH: update an existing draft ──────────────────────────────
export async function PATCH(request: Request) {
  const ip = getClientIp(request);
  const blocked = checkRateLimit(ip);
  if (blocked.blocked) {
    return apiRateLimited(
      `Terlalu banyak percobaan salah. Akses Anda diblokir sementara selama ${blocked.minutesLeft} menit.`,
      blocked.minutesLeft * 60
    );
  }
  if (!isPasscodeConfigured()) {
    return apiServiceUnavailable(
      "Fitur tulis artikel dinonaktifkan sementara karena KODE_AKSES_PENGURUS belum dikonfigurasi."
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return apiBadRequest("Body bukan JSON valid.");
  }

  const parsed = ArticlePatchSchema.safeParse(raw);
  if (!parsed.success) {
    return apiBadRequest(
      "Validasi gagal: " + parsed.error.issues.map((i) => i.message).join("; ")
    );
  }

  if (!verifyPasscode(parsed.data.passcode)) {
    const after = recordFailedAttempt(ip);
    if (after.blocked) {
      return apiRateLimited(
        "Kode Akses salah 5 kali berturut-turut. Akses Anda diblokir sementara selama 15 menit.",
        15 * 60
      );
    }
    return apiUnauthorized(
      `Kode Akses Pengurus tidak valid. Sisa percobaan: ${5 - (after.count ?? 0)}`,
      "AUTH_REQUIRED"
    );
  }
  clearAttempts(ip);

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    return apiServiceUnavailable("SANITY_WRITE_TOKEN belum dikonfigurasi.");
  }

  let imageAssetRef: { _type: "image"; asset: { _type: "reference"; _ref: string } } | null = null;
  if (parsed.data.imageBase64) {
    const img = parseImagePayload(parsed.data.imageBase64);
    if (img && ALLOWED_IMAGE_MIME_TYPES.includes(img.mime) && img.buffer.length <= MAX_IMAGE_BYTES) {
      try {
        const writeClient = getWriteClient(token);
        const uploaded = await writeClient.assets.upload("image", img.buffer, {
          filename: parsed.data.imageName || "updated-cover.jpg",
          contentType: img.mime,
        });
        imageAssetRef = {
          _type: "image",
          asset: { _type: "reference", _ref: uploaded._id },
        };
      } catch (imgErr) {
        console.error("Gagal mengunggah gambar baru:", imgErr);
      }
    }
  }

  try {
    const writeClient = getWriteClient(token);
    const cleanContent = sanitizeContent(parsed.data.content);
    const updatePayload: Record<string, unknown> = {
      title: parsed.data.title,
      author: parsed.data.author,
      publishedAt: parsed.data.publishedAt
        ? new Date(parsed.data.publishedAt).toISOString()
        : new Date().toISOString(),
      category: parsed.data.category,
      excerpt: parsed.data.excerpt,
      content: cleanContent,
      tags: [parsed.data.category.toLowerCase()],
    };
    if (imageAssetRef) updatePayload.coverImage = imageAssetRef;

    const updated = await writeClient.patch(parsed.data.slug).set(updatePayload).commit();
    const updatedId =
      typeof updated === "object" && updated !== null && "_id" in updated
        ? String((updated as { _id: unknown })._id)
        : parsed.data.slug;
    return apiOk("Artikel berhasil diperbarui.", { id: updatedId });
  } catch (err: any) {
    console.error("Sanity patch error:", err);
    return apiServerError("Gagal memperbarui artikel: " + (err?.message ?? "unknown"));
  }
}
