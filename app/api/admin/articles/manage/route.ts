import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

export async function PUT(request: Request) {
  try {
    const { id, title, category, excerpt, content, passcode } = await request.json();

    if (!id || !title || !category || !excerpt || !content) {
      return NextResponse.json({ message: "Semua field wajib diisi." }, { status: 400 });
    }

    const expectedPasscode = process.env.KODE_AKSES_ADMIN || process.env.KODE_AKSES_PENGURUS || "UKMI2026";
    if (passcode !== expectedPasscode) {
      return NextResponse.json({ message: "Kode Akses tidak valid." }, { status: 401 });
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

    await writeClient
      .patch(id)
      .set({
        title,
        category,
        excerpt,
        content
      })
      .commit();

    return NextResponse.json({ message: "Artikel berhasil diperbarui." });
  } catch (err: any) {
    return NextResponse.json({ message: `Gagal memperbarui artikel: ${err.message}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, passcode } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "ID Artikel diperlukan." }, { status: 400 });
    }

    const expectedPasscode = process.env.KODE_AKSES_ADMIN || process.env.KODE_AKSES_PENGURUS || "UKMI2026";
    if (passcode !== expectedPasscode) {
      return NextResponse.json({ message: "Kode Akses tidak valid." }, { status: 401 });
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
