import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  apiOk,
  apiUnauthorized,
  apiServerError,
} from "@/lib/api-response";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/logs - Fetch admin activity logs (latest 100 entries)
 */
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return apiUnauthorized("Akses ditolak: Hanya admin yang diizinkan.");
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return apiServerError("Supabase database belum dikonfigurasi.");
  }

  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 200);
    const actionFilter = searchParams.get("action") || null;

    let query = supabase
      .from("admin_activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (actionFilter) {
      query = query.eq("action", actionFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[admin/logs GET]", error.message);
      return apiServerError("Gagal mengambil log aktivitas.");
    }

    return apiOk("Log aktivitas berhasil diambil.", {
      logs: data || [],
    });
  } catch (err: any) {
    console.error("[admin/logs GET]", err?.message);
    return apiServerError("Terjadi kesalahan internal.");
  }
}
