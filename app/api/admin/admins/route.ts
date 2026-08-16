import { NextRequest } from "next/server";
import { requireAdmin, getEnvAdminEmails } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  AdminEmailCreateSchema,
  AdminEmailUpdateSchema,
  AdminEmailDeleteSchema,
} from "@/lib/schemas";
import {
  apiOk,
  apiUnauthorized,
  apiBadRequest,
  apiServerError,
} from "@/lib/api-response";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/admins — List all authorized admin emails (Deduplicated)
 */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return apiUnauthorized("Akses ditolak: Hanya admin yang diizinkan.");
  }

  const supabase = getSupabaseAdmin();
  const envEmails = getEnvAdminEmails().map((e) => e.toLowerCase());

  let dbAdmins: any[] = [];
  if (supabase) {
    const { data, error } = await supabase
      .from("admin_emails")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      dbAdmins = data;
    }
  }

  // Deduplicate by email map
  const adminMap = new Map<
    string,
    {
      id: string;
      email: string;
      role: string;
      isEnv: boolean;
      isDb: boolean;
      dbId: string | null;
      created_at: string | null;
    }
  >();

  // 1. Process DB Admins
  for (const item of dbAdmins) {
    const normEmail = item.email.toLowerCase();
    const isEnvEmail = envEmails.includes(normEmail);
    adminMap.set(normEmail, {
      id: item.id,
      email: item.email,
      role: item.name?.trim() || "Admin",
      isEnv: isEnvEmail,
      isDb: true,
      dbId: item.id,
      created_at: item.created_at,
    });
  }

  // 2. Process ENV Admins (add if not already in DB)
  for (const email of envEmails) {
    const normEmail = email.toLowerCase();
    if (!adminMap.has(normEmail)) {
      adminMap.set(normEmail, {
        id: `env-${normEmail}`,
        email: normEmail,
        role: "Admin",
        isEnv: true,
        isDb: false,
        dbId: null,
        created_at: null,
      });
    }
  }

  const unifiedAdmins = Array.from(adminMap.values());

  return apiOk("Daftar admin berhasil diambil.", {
    admins: unifiedAdmins,
    currentAdminEmail: admin.email,
  });
}

/**
 * POST /api/admin/admins — Add new admin email allowlist
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
    const parsed = AdminEmailCreateSchema.safeParse(body);

    if (!parsed.success) {
      return apiBadRequest(
        parsed.error.issues?.[0]?.message || "Format input tidak valid."
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const role = parsed.data.name?.trim() || "Admin";

    const { data, error } = await supabase
      .from("admin_emails")
      .upsert(
        {
          email,
          name: role,
          added_by: admin.email || null,
        },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (error) {
      console.error("[admin/admins POST]", error.message);
      return apiServerError("Gagal menambahkan admin.");
    }

    return apiOk("Admin berhasil ditambahkan.", data);
  } catch (err: any) {
    console.error("[admin/admins POST]", err?.message);
    return apiServerError("Terjadi kesalahan internal.");
  }
}

/**
 * PUT /api/admin/admins — Update admin role / email
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
    const parsed = AdminEmailUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return apiBadRequest(
        parsed.error.issues?.[0]?.message || "Format input tidak valid."
      );
    }

    const { id, email, name: role } = parsed.data;
    const normEmail = email.trim().toLowerCase();
    const cleanRole = role?.trim() || "Admin";

    if (id.startsWith("env-")) {
      // Env admin being modified in DB: upsert record
      const { data, error } = await supabase
        .from("admin_emails")
        .upsert(
          {
            email: normEmail,
            name: cleanRole,
            added_by: admin.email || null,
          },
          { onConflict: "email" }
        )
        .select()
        .single();

      if (error) {
        console.error("[admin/admins PUT]", error.message);
        return apiServerError("Gagal memperbarui admin.");
      }
      return apiOk("Data admin berhasil diperbarui.", data);
    }

    const { data, error } = await supabase
      .from("admin_emails")
      .update({
        email: normEmail,
        name: cleanRole,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[admin/admins PUT]", error.message);
      return apiServerError("Gagal memperbarui admin.");
    }

    return apiOk("Data admin berhasil diperbarui.", data);
  } catch (err: any) {
    console.error("[admin/admins PUT]", err?.message);
    return apiServerError("Terjadi kesalahan internal.");
  }
}

/**
 * DELETE /api/admin/admins — Remove admin email
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
    const parsed = AdminEmailDeleteSchema.safeParse(body);

    if (!parsed.success) {
      return apiBadRequest("ID admin tidak valid.");
    }

    if (parsed.data.id.startsWith("env-")) {
      return apiBadRequest(
        "Akun admin yang dikonfigurasi melalui sistem environment (.env) tidak dapat dihapus dari panel web."
      );
    }

    // Fetch target admin to prevent deleting self
    const { data: targetAdmin } = await supabase
      .from("admin_emails")
      .select("email")
      .eq("id", parsed.data.id)
      .single();

    if (
      targetAdmin &&
      targetAdmin.email.toLowerCase() === admin.email?.toLowerCase()
    ) {
      return apiBadRequest("Anda tidak dapat menghapus akun email Anda sendiri.");
    }

    const { error } = await supabase
      .from("admin_emails")
      .delete()
      .eq("id", parsed.data.id);

    if (error) {
      console.error("[admin/admins DELETE]", error.message);
      return apiServerError("Gagal menghapus admin.");
    }

    return apiOk("Akses admin berhasil dicabut.");
  } catch (err: any) {
    console.error("[admin/admins DELETE]", err?.message);
    return apiServerError("Terjadi kesalahan internal.");
  }
}
