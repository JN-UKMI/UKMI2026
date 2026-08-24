import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import sanitizeHtml from "sanitize-html";
import { getSupabaseAdmin, type ShortlinkRow } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";
import {
  ShortlinkCreateSchema,
  ShortlinkUpdateSchema,
  ShortlinkDeleteSchema,
} from "@/lib/schemas";
import {
  apiOk,
  apiUnauthorized,
  apiBadRequest,
  apiServerError,
} from "@/lib/api-response";

export const dynamic = "force-dynamic";

const localLinksFilePath = path.join(
  process.cwd(),
  "content",
  "shortlinks",
  "links.json"
);

async function readLocalShortlinks(): Promise<ShortlinkRow[]> {
  try {
    const data = await fs.readFile(localLinksFilePath, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalShortlinks(links: ShortlinkRow[]): Promise<void> {
  const dir = path.dirname(localLinksFilePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(localLinksFilePath, JSON.stringify(links, null, 2), "utf-8");
}

function sanitizeText(str: string): string {
  return sanitizeHtml(str, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

/**
 * GET /api/admin/shortlinks - List all shortlinks for admin
 */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return apiUnauthorized("Akses ditolak: Hanya admin yang diizinkan.");
  }

  const supabase = getSupabaseAdmin();
  let links: ShortlinkRow[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("shortlinks")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        links = data;
      }
    } catch (err) {
      console.warn("[admin/shortlinks GET Supabase fallback]", err);
    }
  }

  // Fallback to local JSON if Supabase returned nothing or is offline
  if (links.length === 0) {
    try {
      links = await readLocalShortlinks();
      links.sort(
        (a, b) =>
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
      );
    } catch (err) {
      console.warn("[admin/shortlinks GET local fallback]", err);
    }
  }

  return apiOk("Daftar shortlink berhasil diambil.", {
    links,
    total: links.length,
    totalClicks: links.reduce((sum, item) => sum + (item.clicks || 0), 0),
  });
}

/**
 * POST /api/admin/shortlinks - Buat shortlink baru
 */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return apiUnauthorized("Akses ditolak: Hanya admin yang diizinkan.");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiBadRequest("Format data tidak valid.");
  }

  const parseResult = ShortlinkCreateSchema.safeParse(body);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues[0]?.message || "Validasi gagal.";
    return apiBadRequest(errorMsg, "VALIDATION_FAILED", parseResult.error.flatten());
  }

  const cleanSlug = sanitizeText(parseResult.data.slug).toLowerCase();
  const cleanTarget = parseResult.data.target_url.trim();
  const cleanTitle = parseResult.data.title ? sanitizeText(parseResult.data.title) : null;

  if (!cleanSlug || !cleanTarget) {
    return apiBadRequest("Slug dan Target URL tidak boleh kosong.");
  }

  const nowIso = new Date().toISOString();
  let createdItem: ShortlinkRow = {
    id: `shortlink-${Date.now()}-${randomUUID().slice(0, 6)}`,
    slug: cleanSlug,
    target_url: cleanTarget,
    title: cleanTitle,
    clicks: 0,
    created_by: admin.email,
    created_at: nowIso,
    updated_at: nowIso,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      // Check duplicate slug in Supabase
      const { data: existing } = await supabase
        .from("shortlinks")
        .select("id")
        .ilike("slug", cleanSlug)
        .maybeSingle();

      if (existing) {
        return apiBadRequest(
          `Slug '${cleanSlug}' sudah digunakan. Silakan gunakan slug lain.`
        );
      }

      const { data, error } = await supabase
        .from("shortlinks")
        .insert({
          slug: cleanSlug,
          target_url: cleanTarget,
          title: cleanTitle,
          clicks: 0,
          created_by: admin.email,
        })
        .select("*")
        .single();

      if (!error && data) {
        createdItem = data;
      }
    } catch (err) {
      console.warn("[admin/shortlinks POST Supabase fallback]", err);
    }
  }

  // Sync to local fallback
  try {
    const local = await readLocalShortlinks();
    const isDuplicateLocal = local.some(
      (l) => l.slug.toLowerCase() === cleanSlug && l.id !== createdItem.id
    );

    if (isDuplicateLocal && !supabase) {
      return apiBadRequest(
        `Slug '${cleanSlug}' sudah digunakan. Silakan gunakan slug lain.`
      );
    }

    const updated = [
      createdItem,
      ...local.filter((l) => l.id !== createdItem.id && l.slug.toLowerCase() !== cleanSlug),
    ];
    await writeLocalShortlinks(updated);
  } catch (err) {
    console.warn("[admin/shortlinks POST local sync warning]", err);
  }

  return apiOk("Shortlink berhasil dibuat.", createdItem);
}

/**
 * PUT /api/admin/shortlinks - Edit shortlink
 */
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return apiUnauthorized("Akses ditolak: Hanya admin yang diizinkan.");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiBadRequest("Format data tidak valid.");
  }

  const parseResult = ShortlinkUpdateSchema.safeParse(body);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues[0]?.message || "Validasi gagal.";
    return apiBadRequest(errorMsg, "VALIDATION_FAILED", parseResult.error.flatten());
  }

  const { id } = parseResult.data;
  const cleanSlug = sanitizeText(parseResult.data.slug).toLowerCase();
  const cleanTarget = parseResult.data.target_url.trim();
  const cleanTitle = parseResult.data.title ? sanitizeText(parseResult.data.title) : null;
  const nowIso = new Date().toISOString();

  let updatedItem: ShortlinkRow = {
    id,
    slug: cleanSlug,
    target_url: cleanTarget,
    title: cleanTitle,
    clicks: 0,
    updated_at: nowIso,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      // Check duplicate slug in other shortlinks
      const { data: existing } = await supabase
        .from("shortlinks")
        .select("id")
        .ilike("slug", cleanSlug)
        .neq("id", id)
        .maybeSingle();

      if (existing) {
        return apiBadRequest(
          `Slug '${cleanSlug}' sudah digunakan oleh link lain. Silakan gunakan slug unik.`
        );
      }

      const { data, error } = await supabase
        .from("shortlinks")
        .update({
          slug: cleanSlug,
          target_url: cleanTarget,
          title: cleanTitle,
          updated_at: nowIso,
        })
        .eq("id", id)
        .select("*")
        .single();

      if (!error && data) {
        updatedItem = data;
      }
    } catch (err) {
      console.warn("[admin/shortlinks PUT Supabase fallback]", err);
    }
  }

  // Sync to local fallback
  try {
    const local = await readLocalShortlinks();
    const index = local.findIndex((l) => l.id === id);
    if (index !== -1) {
      updatedItem.clicks = local[index].clicks || 0;
      updatedItem.created_at = local[index].created_at || nowIso;
      updatedItem.created_by = local[index].created_by || admin.email;
      local[index] = { ...local[index], ...updatedItem };
    } else {
      local.unshift(updatedItem);
    }
    await writeLocalShortlinks(local);
  } catch (err) {
    console.warn("[admin/shortlinks PUT local sync warning]", err);
  }

  return apiOk("Shortlink berhasil diperbarui.", updatedItem);
}

/**
 * DELETE /api/admin/shortlinks - Hapus shortlink
 */
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return apiUnauthorized("Akses ditolak: Hanya admin yang diizinkan.");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiBadRequest("Format data tidak valid.");
  }

  const parseResult = ShortlinkDeleteSchema.safeParse(body);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues[0]?.message || "Validasi gagal.";
    return apiBadRequest(errorMsg, "VALIDATION_FAILED", parseResult.error.flatten());
  }

  const { id } = parseResult.data;

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { error } = await supabase
        .from("shortlinks")
        .delete()
        .eq("id", id);

      if (error) {
        console.warn("[admin/shortlinks DELETE Supabase warning]", error);
      }
    } catch (err) {
      console.warn("[admin/shortlinks DELETE Supabase fallback]", err);
    }
  }

  // Sync to local fallback
  try {
    const local = await readLocalShortlinks();
    const filtered = local.filter((l) => l.id !== id);
    await writeLocalShortlinks(filtered);
  } catch (err) {
    console.warn("[admin/shortlinks DELETE local sync warning]", err);
  }

  return apiOk("Shortlink berhasil dihapus.", { id });
}
