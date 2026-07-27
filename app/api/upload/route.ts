import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const sanityClient = createClient({
  projectId: "ksc63oa8",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang disertakan" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer for Sanity upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if Sanity token is configured
    if (!process.env.SANITY_WRITE_TOKEN) {
      // Fallback: return a base64 data URL for local development
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({ url: dataUrl });
    }

    // Upload to Sanity Assets
    const asset = await sanityClient.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return NextResponse.json({
      url: asset.url,
      assetId: asset._id,
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah gambar" },
      { status: 500 }
    );
  }
}
