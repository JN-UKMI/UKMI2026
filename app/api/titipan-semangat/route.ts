import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import sanitizeHtml from "sanitize-html";
import { getSupabaseAdmin } from "@/lib/supabase";
import { TitipanSemangatCreateSchema } from "@/lib/schemas";
import { getClientIp, recordAttempt } from "@/lib/api-auth";
import {
  apiOk,
  apiBadRequest,
  apiRateLimited,
  apiServerError,
} from "@/lib/api-response";

export const dynamic = "force-dynamic";

export interface TitipanSemangatItem {
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
    return JSON.parse(raw);
  } catch {
    return [];
  }
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
    console.error("[titipan-semangat writeLocalMessages error]", err);
  }
}

/**
 * GET /api/titipan-semangat - Ambil daftar pesan titipan semangat
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "10", 10), 1), 10);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("titipan_semangat")
        .select("id, name, message, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!error && Array.isArray(data) && data.length > 0) {
        return NextResponse.json({
          ok: true,
          messages: data,
        });
      }
    } catch (err) {
      console.warn("[titipan-semangat Supabase fallback to local]", err);
    }
  }

  // Fallback to local JSON
  const localMessages = await readLocalMessages();
  return NextResponse.json({
    ok: true,
    messages: localMessages.slice(0, limit),
  });
}

/**
 * POST /api/titipan-semangat - Tambah pesan titipan semangat baru
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimitKey = `titipan-semangat:${ip}`;
  const rateCheck = recordAttempt(rateLimitKey, 5, 10 * 60 * 1000, 10 * 60 * 1000);

  if (rateCheck.blocked) {
    return apiRateLimited(
      `Terlalu banyak mengirim pesan. Silakan coba lagi dalam ${rateCheck.minutesLeft} menit.`,
      rateCheck.minutesLeft ? rateCheck.minutesLeft * 60 : undefined
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiBadRequest("Body bukan JSON yang valid.");
  }

  const parsed = TitipanSemangatCreateSchema.safeParse(body);
  if (!parsed.success) {
    return apiBadRequest(
      parsed.error.issues?.[0]?.message || "Data pesan tidak valid."
    );
  }

  const cleanName = sanitizeHtml(parsed.data.name.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });

  const cleanMessage = sanitizeHtml(parsed.data.message.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });

  if (!cleanName || !cleanMessage) {
    return apiBadRequest("Nama dan pesan tidak boleh kosong.");
  }

  const newItem: TitipanSemangatItem = {
    id: randomUUID(),
    name: cleanName,
    message: cleanMessage,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("titipan_semangat")
        .insert({
          id: newItem.id,
          name: newItem.name,
          message: newItem.message,
          created_at: newItem.created_at,
        })
        .select()
        .single();

      if (!error && data) {
        return apiOk("Pesan semangatmu berhasil dititipkan! 🌟", data);
      }
    } catch (err: any) {
      console.warn("[titipan-semangat DB insert fallback]", err?.message);
    }
  }

  // Fallback save to local storage
  const localMessages = await readLocalMessages();
  localMessages.unshift(newItem);
  await writeLocalMessages(localMessages);

  return apiOk("Pesan semangatmu berhasil dititipkan! 🌟", newItem);
}
