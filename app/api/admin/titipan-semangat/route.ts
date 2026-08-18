import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  TitipanSemangatCreateSchema,
  TitipanSemangatUpdateSchema,
  TitipanSemangatDeleteSchema,
} from "@/lib/schemas";
import sanitizeHtml from "sanitize-html";
import {
  apiOk,
  apiUnauthorized,
  apiBadRequest,
  apiServerError,
} from "@/lib/api-response";

export const dynamic = "force-dynamic";

interface TitipanSemangatItem {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const localMessagesFilePath = path.join(
  process.cwd(),
  "content",
  "titipan-semangat",
  "messages.json"
);

async function readLocalMessages(): Promise<TitipanSemangatItem[]> {
  try {
    const raw = await fs.readFile(localMessagesFilePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (err) {
    console.warn("[admin/titipan-semangat readLocalMessages error]", err);
  }
  return [];
}

async function writeLocalMessages(messages: TitipanSemangatItem[]) {
  try {
    await fs.mkdir(path.dirname(localMessagesFilePath), { recursive: true });
    await fs.writeFile(
      localMessagesFilePath,
      JSON.stringify(messages, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("[admin/titipan-semangat writeLocalMessages error]", err);
  }
}

/**
 * GET /api/admin/titipan-semangat - List all titipan semangat messages for admin
 */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return apiUnauthorized("Akses ditolak: Hanya admin yang diizinkan.");
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("titipan_semangat")
        .select("id, name, message, created_at")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        return apiOk("Data pesan titipan semangat berhasil diambil.", data);
      }
    } catch (err) {
      console.warn("[admin/titipan-semangat GET Supabase fallback]", err);
    }
  }

  const local = await readLocalMessages();
  return apiOk("Data pesan titipan semangat lokal berhasil diambil.", local);
}

/**
 * POST /api/admin/titipan-semangat - Tambah pesan baru lewat panel admin
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

  const parseResult = TitipanSemangatCreateSchema.safeParse(body);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues[0]?.message || "Validasi gagal.";
    return apiBadRequest(errorMsg, "VALIDATION_FAILED", parseResult.error.flatten());
  }

  const sanitizedName = sanitizeHtml(parseResult.data.name, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
  const sanitizedMsg = sanitizeHtml(parseResult.data.message, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  if (!sanitizedName || !sanitizedMsg) {
    return apiBadRequest("Nama dan isi pesan tidak boleh kosong.");
  }

  const nowIso = new Date().toISOString();
  let createdItem: TitipanSemangatItem = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: sanitizedName,
    message: sanitizedMsg,
    created_at: nowIso,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("titipan_semangat")
        .insert({
          name: sanitizedName,
          message: sanitizedMsg,
        })
        .select("id, name, message, created_at")
        .single();

      if (!error && data) {
        createdItem = data;
      }
    } catch (err) {
      console.warn("[admin/titipan-semangat POST Supabase fallback]", err);
    }
  }

  // Sync to local fallback
  try {
    const local = await readLocalMessages();
    const updated = [createdItem, ...local.filter((m) => m.id !== createdItem.id)];
    await writeLocalMessages(updated);
  } catch (err) {
    console.warn("[admin/titipan-semangat POST local sync warning]", err);
  }

  return apiOk("Pesan titipan semangat berhasil ditambahkan.", createdItem);
}

/**
 * PUT /api/admin/titipan-semangat - Edit pesan titipan semangat
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

  const parseResult = TitipanSemangatUpdateSchema.safeParse(body);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues[0]?.message || "Validasi gagal.";
    return apiBadRequest(errorMsg, "VALIDATION_FAILED", parseResult.error.flatten());
  }

  const { id } = parseResult.data;
  const sanitizedName = sanitizeHtml(parseResult.data.name, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
  const sanitizedMsg = sanitizeHtml(parseResult.data.message, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  if (!sanitizedName || !sanitizedMsg) {
    return apiBadRequest("Nama dan isi pesan tidak boleh kosong.");
  }

  let updatedItem: TitipanSemangatItem = {
    id,
    name: sanitizedName,
    message: sanitizedMsg,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("titipan_semangat")
        .update({
          name: sanitizedName,
          message: sanitizedMsg,
        })
        .eq("id", id)
        .select("id, name, message, created_at")
        .single();

      if (!error && data) {
        updatedItem = data;
      }
    } catch (err) {
      console.warn("[admin/titipan-semangat PUT Supabase fallback]", err);
    }
  }

  // Sync to local fallback
  try {
    const local = await readLocalMessages();
    const existingIdx = local.findIndex((m) => m.id === id);
    if (existingIdx >= 0) {
      local[existingIdx] = {
        ...local[existingIdx],
        name: sanitizedName,
        message: sanitizedMsg,
      };
      await writeLocalMessages(local);
    }
  } catch (err) {
    console.warn("[admin/titipan-semangat PUT local sync warning]", err);
  }

  return apiOk("Pesan titipan semangat berhasil diperbarui.", updatedItem);
}

/**
 * DELETE /api/admin/titipan-semangat - Hapus pesan titipan semangat
 */
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return apiUnauthorized("Akses ditolak: Hanya admin yang diizinkan.");
  }

  let id: string | null = null;
  const { searchParams } = new URL(req.url);
  id = searchParams.get("id");

  if (!id) {
    try {
      const body = await req.json();
      const parseResult = TitipanSemangatDeleteSchema.safeParse(body);
      if (parseResult.success) {
        id = parseResult.data.id;
      }
    } catch {
      // Ignore
    }
  }

  if (!id) {
    return apiBadRequest("ID pesan wajib disertakan.");
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { error } = await supabase
        .from("titipan_semangat")
        .delete()
        .eq("id", id);

      if (error) {
        console.warn("[admin/titipan-semangat DELETE Supabase]", error.message);
      }
    } catch (err) {
      console.warn("[admin/titipan-semangat DELETE Supabase fallback]", err);
    }
  }

  // Delete from local JSON fallback
  try {
    const local = await readLocalMessages();
    const filtered = local.filter((m) => m.id !== id);
    await writeLocalMessages(filtered);
  } catch (err) {
    console.warn("[admin/titipan-semangat DELETE local sync warning]", err);
  }

  return apiOk("Pesan titipan semangat berhasil dihapus.", { id });
}
