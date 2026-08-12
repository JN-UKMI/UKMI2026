import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { requireAdmin } from "@/lib/auth";

const SANITY_CONFIG = {
  projectId: "ksc63oa8",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
} as const;

// Cache the write client — avoid creating a new HTTP pool on every request
let cachedWriteClient: ReturnType<typeof createClient> | null = null;
function getWriteClient(token: string) {
  if (!cachedWriteClient) {
    cachedWriteClient = createClient({ ...SANITY_CONFIG, token });
  }
  return cachedWriteClient;
}

export async function GET() {
  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ message: "Akses ditolak. Sesi admin tidak valid." }, { status: 403 });
  }

  try {
    const token = process.env.SANITY_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { message: "SANITY_WRITE_TOKEN belum dikonfigurasi." },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    const writeClient = getWriteClient(token);

    const articles = await writeClient.fetch(
      `*[_type == "article" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        category,
        excerpt,
        content,
        publishedAt,
        author,
        coverImage
      }`
    );

    return NextResponse.json({ articles }, { headers: { "Cache-Control": "no-store" } });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Gagal membaca artikel terpublikasi: ${err.message}` },
      { status: 500 }
    );
  }
}
