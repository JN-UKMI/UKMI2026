import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { loadEvents } from "@/lib/content";

export const dynamic = "force-dynamic";

/**
 * GET /api/kalender - Public active events from Supabase with fallback to local JSON
 */
export async function GET() {
  const supabase = getSupabaseClient();
  const localData = await loadEvents();

  if (!supabase) {
    return NextResponse.json({
      success: true,
      data: localData.events || [],
      source: "local",
    });
  }

  try {
    const { data, error } = await supabase
      .from("kalender_events")
      .select("*")
      .order("date", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        success: true,
        data: localData.events || [],
        source: "local-fallback",
      });
    }

    return NextResponse.json({
      success: true,
      data,
      source: "supabase",
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: localData.events || [],
      source: "local-fallback",
    });
  }
}
