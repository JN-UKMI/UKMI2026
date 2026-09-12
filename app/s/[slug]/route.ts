import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getSupabaseAdmin, type ShortlinkRow } from "@/lib/supabase";
import { normalizeShortlinkSlug } from "@/lib/schemas";

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

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const cleanSlug = normalizeShortlinkSlug(slug);

  if (!cleanSlug) {
    return NextResponse.redirect(new URL("/", req.url), { status: 307 });
  }

  // 1. Try Supabase
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("shortlinks")
        .select("slug, target_url")
        .ilike("slug", cleanSlug)
        .maybeSingle();

      if (!error && data && data.target_url) {
        return NextResponse.redirect(data.target_url, { status: 307 });
      }
    } catch (err) {
      console.warn("[shortlink Supabase fetch error, fallback to local]", err);
    }
  }

  // 2. Fallback to Local JSON
  try {
    const localLinks = await readLocalShortlinks();
    const found = localLinks.find(
      (l) => l.slug.toLowerCase() === cleanSlug
    );

    if (found && found.target_url) {
      return NextResponse.redirect(found.target_url, { status: 307 });
    }
  } catch (err) {
    console.warn("[shortlink local fallback error]", err);
  }

  // 3. Not Found -> Redirect to 404 page
  return NextResponse.redirect(new URL("/404", req.url), { status: 307 });
}
