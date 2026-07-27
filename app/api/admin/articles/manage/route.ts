import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { requireAdmin } from "@/lib/auth";

// ── GET: Fetch single article by Sanity ID (for admin edit page) ──
export async function GET(request: Request) {
  try {
    const adminUser = await requireAdmin();
    if (!adminUser) {
      return NextResponse.json({ message: "Akses ditolak. Sesi admin tidak valid." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID Artikel diperlukan." }, { status: 400 });
    }

    const token = process.env.SANITY_WRITE_TOKEN;
    if (!token) {
      // Fallback: return a mock article for simulation mode
      return NextResponse.json({
        article: {
          _id: id,
          title: "[Simulasi] Artikel Demo",
          slug: "artikel-demo",
          category: "Artikel Islami",
          excerpt: "Ini adalah mode simulasi — token Sanity tidak tersedia.",
          content: "<p>Konten artikel simulasi. Token SANITY_WRITE_TOKEN tidak ditemukan.</p>",
          coverImage: null,
          publishedAt: new Date().toISOString(),
          author: "Admin",
        },
      });
    }

    const writeClient = createClient({
      projectId: "ksc63oa8",
      dataset: "production",
      apiVersion: "2024-01-01",
      token: token,
      useCdn: false,
    });

    const article = await writeClient.fetch(
      `*[_type == "article" && _id == $id][0] {
        _id,
        title,
        "slug": slug.current,
        category,
        excerpt,
        content,
        coverImage,
        publishedAt,
        author
      }`,
      { id }
    );

    if (!article) {
      return NextResponse.json({ message: "Artikel tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Gagal mengambil artikel: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const adminUser = await requireAdmin();
    if (!adminUser) {
      return NextResponse.json({ message: "Akses ditolak. Sesi admin tidak valid." }, { status: 403 });
    }

    const { id, title, category, excerpt, content, author } = await request.json();

    if (!id || !title || !category || !excerpt || !content) {
      return NextResponse.json({ message: "Semua field wajib diisi." }, { status: 400 });
    }

    const token = process.env.SANITY_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ message: "Mode Simulasi: Artikel berhasil diedit (Simulasi)." });
    }

    const writeClient = createClient({
      projectId: "ksc63oa8",
      dataset: "production",
      apiVersion: "2024-01-01",
      token: token,
      useCdn: false,
    });

    const patchData: Record<string, any> = { title, category, excerpt, content };
    if (author !== undefined) patchData.author = author;

    await writeClient
      .patch(id)
      .set(patchData)
      .commit();

    return NextResponse.json({ message: "Artikel berhasil diperbarui." });
  } catch (err: any) {
    return NextResponse.json({ message: `Gagal memperbarui artikel: ${err.message}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const adminUser = await requireAdmin();
    if (!adminUser) {
      return NextResponse.json({ message: "Akses ditolak. Sesi admin tidak valid." }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "ID Artikel diperlukan." }, { status: 400 });
    }

    const token = process.env.SANITY_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ message: "Mode Simulasi: Artikel berhasil dihapus (Simulasi)." });
    }

    const writeClient = createClient({
      projectId: "ksc63oa8",
      dataset: "production",
      apiVersion: "2024-01-01",
      token: token,
      useCdn: false,
    });

    await writeClient.delete(id);

    return NextResponse.json({ message: "Artikel berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ message: `Gagal menghapus artikel: ${err.message}` }, { status: 500 });
  }
}
