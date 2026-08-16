import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  KalenderEventCreateSchema,
  KalenderEventUpdateSchema,
  KalenderEventDeleteSchema,
} from "@/lib/schemas";
import {
  apiOk,
  apiUnauthorized,
  apiBadRequest,
  apiServerError,
} from "@/lib/api-response";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/kalender — List all kalender events from Supabase
 */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return apiUnauthorized("Akses ditolak: Hanya admin yang diizinkan.");
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return apiOk("Supabase belum terhubung.", []);
  }

  try {
    const { data, error } = await supabase
      .from("kalender_events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      return apiServerError(`Gagal mengambil data kalender: ${error.message}`);
    }

    return apiOk("Data kalender berhasil diambil.", data || []);
  } catch (err: any) {
    return apiServerError(err?.message || "Terjadi kesalahan internal.");
  }
}

/**
 * POST /api/admin/kalender — Add new event to Kalender UKMI
 */
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return apiUnauthorized("Akses ditolak: Hanya admin yang diizinkan.");
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return apiServerError("Supabase database belum dikonfigurasi.");
  }

  try {
    const body = await req.json();
    const parsed = KalenderEventCreateSchema.safeParse(body);

    if (!parsed.success) {
      return apiBadRequest(
        parsed.error.issues?.[0]?.message || "Format agenda tidak valid."
      );
    }

    const { data, error } = await supabase
      .from("kalender_events")
      .insert({
        title: parsed.data.title.trim(),
        date: parsed.data.date,
        time: parsed.data.time?.trim() || null,
        location: parsed.data.location?.trim() || null,
        type: parsed.data.type,
        bidang: parsed.data.bidang?.trim() || null,
        description: parsed.data.description?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      return apiServerError(`Gagal menambahkan agenda: ${error.message}`);
    }

    return apiOk("Agenda kalender berhasil ditambahkan.", data);
  } catch (err: any) {
    return apiServerError(err?.message || "Terjadi kesalahan internal.");
  }
}

/**
 * PUT /api/admin/kalender — Update existing event in Kalender UKMI
 */
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return apiUnauthorized("Akses ditolak: Hanya admin yang diizinkan.");
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return apiServerError("Supabase database belum dikonfigurasi.");
  }

  try {
    const body = await req.json();
    const parsed = KalenderEventUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return apiBadRequest(
        parsed.error.issues?.[0]?.message || "Format agenda tidak valid."
      );
    }

    const { data, error } = await supabase
      .from("kalender_events")
      .update({
        title: parsed.data.title.trim(),
        date: parsed.data.date,
        time: parsed.data.time?.trim() || null,
        location: parsed.data.location?.trim() || null,
        type: parsed.data.type,
        bidang: parsed.data.bidang?.trim() || null,
        description: parsed.data.description?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.id)
      .select()
      .single();

    if (error) {
      return apiServerError(`Gagal memperbarui agenda: ${error.message}`);
    }

    return apiOk("Agenda kalender berhasil diperbarui.", data);
  } catch (err: any) {
    return apiServerError(err?.message || "Terjadi kesalahan internal.");
  }
}

/**
 * DELETE /api/admin/kalender — Delete event from Kalender UKMI
 */
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return apiUnauthorized("Akses ditolak: Hanya admin yang diizinkan.");
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return apiServerError("Supabase database belum dikonfigurasi.");
  }

  try {
    const body = await req.json();
    const parsed = KalenderEventDeleteSchema.safeParse(body);

    if (!parsed.success) {
      return apiBadRequest("ID agenda tidak valid.");
    }

    const { error } = await supabase
      .from("kalender_events")
      .delete()
      .eq("id", parsed.data.id);

    if (error) {
      return apiServerError(`Gagal menghapus agenda: ${error.message}`);
    }

    return apiOk("Agenda kalender berhasil dihapus.", null);
  } catch (err: any) {
    return apiServerError(err?.message || "Terjadi kesalahan internal.");
  }
}
