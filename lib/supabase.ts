import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface KalenderEventRow {
  id: string;
  title: string;
  date: string; // ISO format: YYYY-MM-DD
  time?: string | null;
  location?: string | null;
  type: string; // "Agenda UKMI" | "Puasa Sunnah"
  bidang?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AdminEmailRow {
  id: string;
  email: string;
  name?: string | null;
  added_by?: string | null;
  created_at?: string;
}

export interface ShortlinkRow {
  id: string;
  slug: string;
  target_url: string;
  title?: string | null;
  clicks: number;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Global cached client instance
let cachedSupabase: SupabaseClient | null = null;
let cachedSupabaseAdmin: SupabaseClient | null = null;

/**
 * Returns a Supabase client using public anon key.
 * Returns null if Supabase environment variables are not configured.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!cachedSupabase) {
    cachedSupabase = createClient(url, anonKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  return cachedSupabase;
}

/**
 * Returns a privileged Supabase admin client (server-side only)
 * using SUPABASE_SERVICE_ROLE_KEY (or fallback to anonKey).
 * Returns null if Supabase environment variables are not configured.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  if (!cachedSupabaseAdmin) {
    cachedSupabaseAdmin = createClient(url, key, {
      auth: {
        persistSession: false,
      },
    });
  }

  return cachedSupabaseAdmin;
}
