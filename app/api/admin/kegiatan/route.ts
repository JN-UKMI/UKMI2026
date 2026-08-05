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
  KegiatanCreateSchema,
  KegiatanUpdateSchema,
  KegiatanDeleteQuerySchema,
  ContentType,
  ALLOWED_IMAGE_MIME_TYPES,
  type KegiatanCreatePayload,
} from "@/lib/schemas";
import type { KegiatanSeruItem } from "@/lib/types";
import { getKegiatanSeruFromSanity } from "@/lib/sanity";

const eventsFilePath = path.join(process.cwd(), "content", "kegiatan-seru", "events.json");
const uploadDir = path.join(process.cwd(), "public", "events");

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

async function readEvents(): Promise<KegiatanSeruItem[]> {
  try {
    const raw = await fs.readFile(eventsFilePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeEvents(events: KegiatanSeruItem[]) {
  await fs.mkdir(path.dirname(eventsFilePath), { recursive: true });
  await fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2), "utf-8");
}

// Map MIME → safe extension. Rejected MIME types fail before reaching here.
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

// Validates an optional poster upload. Returns `true` if no poster is present
// (because the caller treats `undefined`/empty as legitimate), `true` if the
// file is valid (correct MIME + ≤ 5MB), and `false` if the file is present but
// invalid. Callers should reject on `false`.
const MAX_POSTER_BYTES = 2 * 1024 * 1024; // 2MB — sinkron dengan penjelasan & validasi client di form admin
function validatePosterFile(value: FormDataEntryValue | null): boolean {
  if (!(value instanceof File) || value.size === 0) return true;
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(value.type)) return false;
  if (value.size > MAX_POSTER_BYTES) return false;
  return true;
}

// Sanitize the local-only event payload. Description is rendered as text via
// the front-end so any HTML/JS gets stripped before reaching the JSON file.
function sanitizeLocalEvent(input: KegiatanCreatePayload): KegiatanCreatePayload {
  return {
    ...input,
    title: sanitizeHtml(input.title, { allowedTags: [], allowedAttributes: {} }),
    description: sanitizeHtml(input.description, {
      allowedTags: ["br"],
      allowedAttributes: {},
    }),
    location: input.location
      ? sanitizeHtml(input.location, { allowedTags: [], allowedAttributes: {} })
      : undefined,
  };
}

// ── GET: Fetch all active events (admin or passcode gated? — read-only public) ──
export async function GET() {
  const sanityEvents = await getKegiatanSeruFromSanity();
  if (sanityEvents.length > 0) {
    return NextResponse.json({ events: sanityEvents }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
  }
  const events = await readEvents();
  return NextResponse.json({ events });
}

// ── POST: add new event (admin gated, optional poster) ──
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiUnauthorized();

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return apiBadRequest("Body bukan form-data valid.");
  }

  // Validate text fields via zod (excluding poster which is multipart).
  const parsed = KegiatanCreateSchema.safeParse({
    title: formData.get("title"),
    date: formData.get("date"),
    dayBadge: formData.get("dayBadge"),
    monthBadge: formData.get("monthBadge"),
    location: formData.get("location") || undefined,
    description: formData.get("description"),
    instagramUrl: formData.get("instagramUrl") || undefined,
  });
  if (!parsed.success) {
    return apiBadRequest(
      "Validasi gagal: " + parsed.error.issues.map((i) => i.message).join("; ")
    );
  }
  // parsed.data (from KegiatanCreateSchema) is already KegiatanCreatePayload —
  // no `id` to strip. Pass straight through to the sanitizer.
  const clean = sanitizeLocalEvent(parsed.data);

  const posterFile = formData.get("poster");
  if (!validatePosterFile(posterFile)) {
    return apiBadRequest(
      "Poster tidak valid: format harus JPG/PNG/WEBP/GIF dan ukuran maksimal 2MB."
    );
  }

  const sanityClient = getSanityWriteClient();

  if (sanityClient) {
    let imageRef: { _type: "image"; asset: { _type: "reference"; _ref: string } } | null = null;
    if (posterFile instanceof File && posterFile.size > 0) {
      try {
        const buffer = Buffer.from(await posterFile.arrayBuffer());
        const asset = await sanityClient.assets.upload("image", buffer, {
          filename: `poster-${randomUUID()}.${extFromMime(posterFile.type)}`,
          contentType: posterFile.type,
        });
        imageRef = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
      } catch (err) {
        console.error("Sanity poster upload failed", err);
        return apiServerError("Gagal mengunggah poster ke Sanity.");
      }
    }

    try {
      const doc = {
        _type: "kegiatan",
        title: clean.title,
        date: clean.date,
        dayBadge: clean.dayBadge.trim(),
        monthBadge: clean.monthBadge.trim().toUpperCase(),
        location: clean.location || "Universitas Sebelas Maret",
        description: clean.description,
        instagramUrl:
          clean.instagramUrl && clean.instagramUrl.length > 0
            ? clean.instagramUrl
            : "https://www.instagram.com/jnukmiuns/",
        createdAt: new Date().toISOString(),
        ...(imageRef ? { poster: imageRef } : {}),
      };
      const created = await sanityClient.create(doc);
      return apiOk("Event Terdekat berhasil ditambahkan ke Sanity CMS Cloud!", created);
    } catch (err: any) {
      return apiServerError("Gagal menyimpan ke Sanity: " + (err?.message ?? "unknown"));
    }
  }

  // Local fallback
  let posterUrl = "/placeholder.png";
  if (posterFile instanceof File && posterFile.size > 0) {
    const buffer = Buffer.from(await posterFile.arrayBuffer());
    const filename = `event-${randomUUID()}${extFromMime(posterFile.type)}`;
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    posterUrl = `/events/${filename}`;
  }

  const newEvent: KegiatanSeruItem = {
    id: `event-${randomUUID()}`,
    title: clean.title,
    date: clean.date,
    dayBadge: clean.dayBadge.trim(),
    monthBadge: clean.monthBadge.trim().toUpperCase(),
    location: clean.location || "Universitas Sebelas Maret",
    description: clean.description,
    posterUrl,
    instagramUrl:
      clean.instagramUrl && clean.instagramUrl.length > 0
        ? clean.instagramUrl
        : "https://www.instagram.com/jnukmiuns/",
    createdAt: new Date().toISOString(),
  };

  const events = await readEvents();
  events.unshift(newEvent);
  await writeEvents(events);

  return apiOk("Event Terdekat berhasil ditambahkan!", newEvent);
}

// ── PUT: edit existing event (admin gated) ──
export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiUnauthorized();

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return apiBadRequest("Body bukan form-data valid.");
  }

  const parsed = KegiatanUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    date: formData.get("date"),
    dayBadge: formData.get("dayBadge"),
    monthBadge: formData.get("monthBadge"),
    location: formData.get("location") || undefined,
    description: formData.get("description"),
    instagramUrl: formData.get("instagramUrl") || undefined,
  });
  if (!parsed.success) {
    return apiBadRequest(
      "Validasi gagal: " + parsed.error.issues.map((i) => i.message).join("; ")
    );
  }
  const { id: eventId, ...eventFields } = parsed.data;
  void eventId;
  const clean = sanitizeLocalEvent(eventFields);

  const posterFile = formData.get("poster");
  if (!validatePosterFile(posterFile)) {
    return apiBadRequest(
      "Poster tidak valid: format harus JPG/PNG/WEBP/GIF dan ukuran maksimal 2MB."
    );
  }

  const sanityClient = getSanityWriteClient();

  if (sanityClient && !parsed.data.id.startsWith("event-")) {
    let imageRef: { _type: "image"; asset: { _type: "reference"; _ref: string } } | null = null;
    if (posterFile instanceof File && posterFile.size > 0) {
      try {
        const buffer = Buffer.from(await posterFile.arrayBuffer());
        const asset = await sanityClient.assets.upload("image", buffer, {
          filename: `poster-${randomUUID()}.${extFromMime(posterFile.type)}`,
          contentType: posterFile.type,
        });
        imageRef = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
      } catch (err) {
        console.error("Sanity poster upload failed", err);
        return apiServerError("Gagal mengunggah poster ke Sanity.");
      }
    }

    try {
      const patchData: Record<string, unknown> = {
        title: clean.title,
        date: clean.date,
        dayBadge: clean.dayBadge.trim(),
        monthBadge: clean.monthBadge.trim().toUpperCase(),
        location: clean.location || "Universitas Sebelas Maret",
        description: clean.description,
        instagramUrl:
          clean.instagramUrl && clean.instagramUrl.length > 0
            ? clean.instagramUrl
            : "https://www.instagram.com/jnukmiuns/",
      };
      if (imageRef) patchData.poster = imageRef;
      const updated = await sanityClient.patch(parsed.data.id).set(patchData).commit();
      return apiOk("Event Terdekat berhasil diperbarui di Sanity CMS Cloud!", updated);
    } catch (err: any) {
      return apiServerError("Gagal memperbarui: " + (err?.message ?? "unknown"));
    }
  }

  // Local fallback
  const events = await readEvents();
  const idx = events.findIndex((e) => e.id === parsed.data.id);
  if (idx === -1) return apiNotFound("Kegiatan tidak ditemukan.");

  let posterUrl = events[idx].posterUrl;
  if (posterFile instanceof File && posterFile.size > 0) {
    const buffer = Buffer.from(await posterFile.arrayBuffer());
    const filename = `event-${randomUUID()}${extFromMime(posterFile.type)}`;
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    posterUrl = `/events/${filename}`;
  }

  events[idx] = {
    ...events[idx],
    title: clean.title,
    date: clean.date,
    dayBadge: clean.dayBadge.trim(),
    monthBadge: clean.monthBadge.trim().toUpperCase(),
    location: clean.location || "Universitas Sebelas Maret",
    description: clean.description,
    posterUrl,
    instagramUrl:
      clean.instagramUrl && clean.instagramUrl.length > 0
        ? clean.instagramUrl
        : "https://www.instagram.com/jnukmiuns/",
  };
  await writeEvents(events);

  return apiOk("Event Terdekat berhasil diperbarui!", events[idx]);
}

// ── DELETE: remove event (admin gated) ──
export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiUnauthorized();

  const { searchParams } = new URL(req.url);
  const parsed = KegiatanDeleteQuerySchema.safeParse({
    id: searchParams.get("id"),
  });
  if (!parsed.success) {
    return apiBadRequest("ID kegiatan tidak valid.");
  }

  const sanityClient = getSanityWriteClient();
  if (sanityClient && !parsed.data.id.startsWith("event-")) {
    try {
      await sanityClient.delete(parsed.data.id);
      return apiOk("Kegiatan berhasil dihapus dari Sanity CMS Cloud.");
    } catch (err: any) {
      return apiServerError("Gagal menghapus dari Sanity: " + (err?.message ?? "unknown"));
    }
  }

  const events = await readEvents();
  const target = events.find((e) => e.id === parsed.data.id);
  if (!target) return apiNotFound("Kegiatan tidak ditemukan.");

  if (target.posterUrl.startsWith("/events/")) {
    try {
      await fs.unlink(path.join(process.cwd(), "public", target.posterUrl));
    } catch {}
  }

  await writeEvents(events.filter((e) => e.id !== parsed.data.id));
  return apiOk("Kegiatan berhasil dihapus.");
}
