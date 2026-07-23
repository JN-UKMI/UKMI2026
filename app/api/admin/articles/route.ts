import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

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

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();

    const expectedPasscode = process.env.KODE_AKSES_ADMIN || process.env.KODE_AKSES_PENGURUS || "UKMI2026";
    if (passcode !== expectedPasscode) {
      return NextResponse.json(
        { message: "Kode Akses tidak valid." },
        { status: 401 }
      );
    }

    const token = process.env.SANITY_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ articles: [], fallback: true });
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
        author
      }`
    );

    return NextResponse.json({ articles, fallback: false });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Gagal membaca artikel terpublikasi: ${err.message}` },
      { status: 500 }
    );
  }
}
