import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

export async function POST(request: Request) {
  try {
    const { draftId, passcode } = await request.json();

    if (!draftId) {
      return NextResponse.json({ message: "ID Artikel draft diperlukan." }, { status: 400 });
    }

    const expectedPasscode = process.env.KODE_AKSES_PENGURUS || "UKMI2026";
    if (passcode !== expectedPasscode) {
      return NextResponse.json(
        { message: "Kode Akses Admin tidak valid." },
        { status: 401 }
      );
    }

    const token = process.env.SANITY_WRITE_TOKEN;
    if (!token) {
      // Mock successful approval during development/fallback
      return NextResponse.json({ 
        message: "Simulasi: Artikel berhasil disetujui dan dipublikasikan (Mode Fallback).",
        publishedId: draftId.replace("drafts.", "")
      });
    }

    const writeClient = createClient({
      projectId: "ksc63oa8",
      dataset: "production",
      apiVersion: "2024-01-01",
      token: token,
      useCdn: false,
    });

    // 1. Fetch the draft document
    const draftDoc = await writeClient.getDocument(draftId);
    if (!draftDoc) {
      return NextResponse.json({ message: "Artikel draf tidak ditemukan." }, { status: 404 });
    }

    const publishedId = draftId.replace("drafts.", "");

    // 2. Perform transaction: copy to published ID and delete the draft ID
    await writeClient
      .transaction()
      .createOrReplace({
        ...draftDoc,
        _id: publishedId,
      })
      .delete(draftId)
      .commit();

    return NextResponse.json({ 
      message: "Artikel berhasil disetujui dan dipublikasikan.",
      publishedId
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Gagal menyetujui artikel: ${err.message}` },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const { draftId, passcode } = await request.json();

    if (!draftId) {
      return NextResponse.json({ message: "ID Artikel draft diperlukan." }, { status: 400 });
    }

    const expectedPasscode = process.env.KODE_AKSES_PENGURUS || "UKMI2026";
    if (passcode !== expectedPasscode) {
      return NextResponse.json(
        { message: "Kode Akses Admin tidak valid." },
        { status: 401 }
      );
    }

    const token = process.env.SANITY_WRITE_TOKEN;
    if (!token) {
      // Mock successful deletion during development/fallback
      return NextResponse.json({ 
        message: "Simulasi: Artikel berhasil ditolak dan dihapus (Mode Fallback)."
      });
    }

    const writeClient = createClient({
      projectId: "ksc63oa8",
      dataset: "production",
      apiVersion: "2024-01-01",
      token: token,
      useCdn: false,
    });

    // Delete the draft document
    await writeClient.delete(draftId);

    return NextResponse.json({ 
      message: "Artikel draf berhasil dihapus."
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: `Gagal menghapus artikel draf: ${err.message}` },
      { status: 500 }
    );
  }
}
