import { getSupabaseAdmin } from "./supabase";

export type AdminAction =
  | "login"
  | "logout"
  | "approve_article"
  | "reject_article"
  | "update_article"
  | "delete_article"
  | "create_kegiatan"
  | "update_kegiatan"
  | "delete_kegiatan"
  | "create_media_space"
  | "update_media_space"
  | "delete_media_space"
  | "reorder_media_space"
  | "create_kalender"
  | "update_kalender"
  | "delete_kalender"
  | "add_admin"
  | "update_admin"
  | "delete_admin"
  | "create_titipan"
  | "update_titipan"
  | "delete_titipan"
  | "create_shortlink"
  | "update_shortlink"
  | "delete_shortlink"
  | "other";

interface LogEntry {
  admin_email: string;
  admin_name?: string | null;
  action: AdminAction;
  target_type?: string | null;
  target_id?: string | null;
  target_name?: string | null;
  details?: string | null;
}

/**
 * Log an admin activity to the admin_activity_logs Supabase table.
 * Failures are silently ignored to never break the caller's flow.
 */
export async function logAdminActivity(entry: LogEntry): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;

    await supabase.from("admin_activity_logs").insert({
      admin_email: entry.admin_email,
      admin_name: entry.admin_name || null,
      action: entry.action,
      target_type: entry.target_type || null,
      target_id: entry.target_id || null,
      target_name: entry.target_name || null,
      details: entry.details || null,
    });
  } catch {
    // Silently ignore – logging should never break the caller
  }
}
