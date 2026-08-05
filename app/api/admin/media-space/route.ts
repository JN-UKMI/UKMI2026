import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createClient } from "next-sanity";
import { randomUUID } from "node:crypto";
import sanitizeHtml from "sanitize-html";

import { requireAdmin } from "@/lib/auth";
import {
  apiOk,
  apiBadRequest,
  apiUnauthorized,
  apiServerError,
  apiNotFound,
} from "@/lib/api-response";
import {
  MediaSpaceCreateSchema,
  MediaSpaceUpdateSchema,
  MediaSpaceDeleteQuerySchema,
  ContentType,
  ALLOWED_IMAGE_MIME_TYPES,
  type MediaSpaceCreatePayload,
} from "@/lib/schemas";
import type { MediaSpaceItem } from "@/lib/types";
import { getMediaSpaceFromSanity } from "@/lib/sanity";

const itemsFilePath = path.join(process.cwd(), "content", "media-space", "main.json");
const uploadDir = path.join(process.cwd(), "public", "media-space");

function getSanityWriteClient() {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) return null;
  return createClient({
    projectId: "ksc63oa8",
    dataset: "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });
}

async function readItems(): Promise<MediaSpaceItem[]> {
  try {
    const raw = await fs.readFile(itemsFilePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeItems(items: MediaSpaceItem[]) {
  await fs.mkdir(path.dirname(itemsFilePath), { recursive: true });
  await fs.writeFile(itemsFilePath, JSON.stringify(items, null, 2), "utf-8");
}

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

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
function validateImageFile(value: FormDataEntryValue | null): boolean {
  if (!(value instanceof File) || value.size === 0) return true;
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(value.type)) return false;
  if (value.size > MAX_IMAGE_BYTES) return false;
  return true;
}

function sanitizeLocalItem(input: MediaSpaceCreatePayload): MediaSpaceCreatePayload {
  return {
    ...input,
    title: sanitizeHtml(input.title, { allowedTags: [], allowedAttributes: {} }),
    description: input.description
      ? sanitizeHtml(input.description, { allowedTags: [], allowedAttributes: {} })
      : undefined,
  };
}

// ── GET: ambil semua konten Media Space (publik — untuk section beranda) ──
export async function GET() {
  const sanityItems = await getMediaSpaceFromSanity();
  if (sanityItems.length > 0) {
    return NextResponse.json(
      { items: sanityItems },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  }
  const items = await readItems();
  return NextResponse.json({ items });
}

// ── POST: tambah konten baru (admin gated, opsional upload gambar) ──
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiUnauthorized();

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return apiBadRequest("Body bukan form-data valid.");
  }

  const parsed = MediaSpaceCreateSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    instagramUrl: formData.get("instagramUrl") || undefined,
  });
  if (!parsed.success) {
    return apiBadRequest(
      "Validasi gagal: " + parsed.error.issues.map((i) => i.message).join("; ")
    );
  }
  const clean = sanitizeLocalItem(parsed.data);

  const imageFile = formData.get("image");
  if (!validateImageFile(imageFile)) {
    return apiBadRequest("Gambar tidak valid: format harus JPG/PNG/WEBP/GIF dan ukuran maksimal 2MB.");
  }

  const sanityClient = getSanityWriteClient();

  if (sanityClient) {
    let imageRef: { _type: "image"; asset: { _type: "reference"; _ref: string } } | null = null;
    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const asset = await sanityClient.assets.upload("image", buffer, {
          filename: `media-space-${randomUUID()}.${extFromMime(imageFile.type)}`,
          contentType: imageFile.type,
        });
        imageRef = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
      } catch (err) {
        console.error("Sanity media-space image upload failed", err);
        return apiServerError("Gagal mengunggah gambar ke Sanity.");
      }
    }

    try {
      const doc = {
        _type: "mediaPost",
        title: clean.title,
        description: clean.description || "",
        instagramUrl:
          clean.instagramUrl && clean.instagramUrl.length > 0
            ? clean.instagramUrl
            : "https://www.instagram.com/jnukmiuns/",
        createdAt: new Date().toISOString(),
        ...(imageRef ? { image: imageRef } : {}),
      };
      const created = await sanityClient.create(doc);
      return apiOk("Konten Media Space berhasil ditambahkan ke Sanity CMS!", created);
    } catch (err: any) {
      return apiServerError("Gagal menyimpan ke Sanity: " + (err?.message ?? "unknown"));
    }
  }

  // Fallback lokal
  let imageUrl = "/placeholder.png";
  if (imageFile instanceof File && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const filename = `media-space-${randomUUID()}${extFromMime(imageFile.type)}`;
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    imageUrl = `/media-space/${filename}`;
  }

  const newItem: MediaSpaceItem = {
    id: `media-space-${randomUUID()}`,
    title: clean.title,
    description: clean.description || "",
    instagramUrl:
      clean.instagramUrl && clean.instagramUrl.length > 0
        ? clean.instagramUrl
        : "https://www.instagram.com/jnukmiuns/",
    imageUrl,
    createdAt: new Date().toISOString(),
  };

  const items = await readItems();
  items.unshift(newItem);
  await writeItems(items);

  return apiOk("Konten Media Space berhasil ditambahkan!", newItem);
}

// ── PUT: edit konten (admin gated, opsional ganti gambar) ──
export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiUnauthorized();

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return apiBadRequest("Body bukan form-data valid.");
  }

  const parsed = MediaSpaceUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    instagramUrl: formData.get("instagramUrl") || undefined,
  });
  if (!parsed.success) {
    return apiBadRequest(
      "Validasi gagal: " + parsed.error.issues.map((i) => i.message).join("; ")
    );
  }
  const { id: itemId, ...itemFields } = parsed.data;
  const clean = sanitizeLocalItem(itemFields);

  const imageFile = formData.get("image");
  if (!validateImageFile(imageFile)) {
    return apiBadRequest("Gambar tidak valid: format harus JPG/PNG/WEBP/GIF dan ukuran maksimal 2MB.");
  }

  const sanityClient = getSanityWriteClient();

  if (sanityClient && !itemId.startsWith("media-space-")) {
    let imageRef: { _type: "image"; asset: { _type: "reference"; _ref: string } } | null = null;
    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const asset = await sanityClient.assets.upload("image", buffer, {
          filename: `media-space-${randomUUID()}.${extFromMime(imageFile.type)}`,
          contentType: imageFile.type,
        });
        imageRef = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
      } catch (err) {
        console.error("Sanity media-space image upload failed", err);
        return apiServerError("Gagal mengunggah gambar ke Sanity.");
      }
    }

    try {
      const patchData: Record<string, unknown> = {
        title: clean.title,
        description: clean.description || "",
        instagramUrl:
          clean.instagramUrl && clean.instagramUrl.length > 0
            ? clean.instagramUrl
            : "https://www.instagram.com/jnukmiuns/",
      };
      if (imageRef) patchData.image = imageRef;
      const updated = await sanityClient.patch(itemId).set(patchData).commit();
      return apiOk("Konten Media Space berhasil diperbarui di Sanity CMS!", updated);
    } catch (err: any) {
      return apiServerError("Gagal memperbarui: " + (err?.message ?? "unknown"));
    }
  }

  // Fallback lokal
  const items = await readItems();
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx === -1) return apiNotFound("Konten Media Space tidak ditemukan.");

  let imageUrl = items[idx].imageUrl;
  if (imageFile instanceof File && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const filename = `media-space-${randomUUID()}${extFromMime(imageFile.type)}`;
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    // Hapus file gambar lama agar tidak menumpuk di disk
    if (imageUrl.startsWith("/media-space/") && imageUrl !== `/media-space/${filename}`) {
      try {
        await fs.unlink(path.join(process.cwd(), "public", imageUrl));
      } catch {}
    }
    imageUrl = `/media-space/${filename}`;
  }

  items[idx] = {
    ...items[idx],
    title: clean.title,
    description: clean.description || "",
    instagramUrl:
      clean.instagramUrl && clean.instagramUrl.length > 0
        ? clean.instagramUrl
        : "https://www.instagram.com/jnukmiuns/",
    imageUrl,
  };
  await writeItems(items);

  return apiOk("Konten Media Space berhasil diperbarui!", items[idx]);
}

// ── DELETE: hapus konten (admin gated) ──
export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiUnauthorized();

  const { searchParams } = new URL(req.url);
  const parsed = MediaSpaceDeleteQuerySchema.safeParse({
    id: searchParams.get("id"),
  });
  if (!parsed.success) {
    return apiBadRequest("ID konten tidak valid.");
  }

  const sanityClient = getSanityWriteClient();
  if (sanityClient && !parsed.data.id.startsWith("media-space-")) {
    try {
      await sanityClient.delete(parsed.data.id);
      return apiOk("Konten Media Space berhasil dihapus dari Sanity CMS.");
    } catch (err: any) {
      return apiServerError("Gagal menghapus dari Sanity: " + (err?.message ?? "unknown"));
    }
  }

  const items = await readItems();
  const target = items.find((i) => i.id === parsed.data.id);
  if (!target) return apiNotFound("Konten Media Space tidak ditemukan.");

  if (target.imageUrl.startsWith("/media-space/")) {
    try {
      await fs.unlink(path.join(process.cwd(), "public", target.imageUrl));
    } catch {}
  }

  await writeItems(items.filter((i) => i.id !== parsed.data.id));
  return apiOk("Konten Media Space berhasil dihapus.");
}
