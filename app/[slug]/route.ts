import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getSupabaseAdmin, type ShortlinkRow } from "@/lib/supabase";
import { RESERVED_SLUGS } from "@/lib/schemas";

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

async function incrementLocalClicks(slug: string): Promise<void> {
  try {
    const links = await readLocalShortlinks();
    const index = links.findIndex(
      (l) => l.slug.toLowerCase() === slug.toLowerCase()
    );
    if (index !== -1) {
      links[index].clicks = (links[index].clicks || 0) + 1;
      links[index].updated_at = new Date().toISOString();
      await fs.writeFile(localLinksFilePath, JSON.stringify(links, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("[shortlink local increment error]", err);
  }
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const cleanSlug = (slug || "").trim().toLowerCase();

  // If empty or matches system reserved path, do not process as shortlink
  if (!cleanSlug || RESERVED_SLUGS.has(cleanSlug)) {
    return NextResponse.redirect(new URL("/404", req.url), { status: 307 });
  }

  // 1. Try Supabase
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("shortlinks")
        .select("id, slug, target_url, clicks")
        .ilike("slug", cleanSlug)
        .maybeSingle();

      if (!error && data && data.target_url) {
        // Increment click count asynchronously in background
        void supabase
          .from("shortlinks")
          .update({
            clicks: (data.clicks || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.id);

        return NextResponse.redirect(data.target_url, { status: 307 });
      }
    } catch (err) {
      console.warn("[shortlink root Supabase fetch error, fallback to local]", err);
    }
  }

  // 2. Fallback to Local JSON
  try {
    const localLinks = await readLocalShortlinks();
    const found = localLinks.find(
      (l) => l.slug.toLowerCase() === cleanSlug
    );

    if (found && found.target_url) {
      incrementLocalClicks(cleanSlug).catch(() => {});
      return NextResponse.redirect(found.target_url, { status: 307 });
    }
  } catch (err) {
    console.warn("[shortlink root local fallback error]", err);
  }

  // 3. Not Found -> Redirect to 404 page
  return NextResponse.redirect(new URL("/404", req.url), { status: 307 });
}
