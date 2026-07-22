import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

// In-memory store for rate limiting brute force attempts
const failedAttempts = new Map<string, { count: number; blockedUntil: number }>();

const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "anonymous-ip";
}

// Simple slugify function
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-dan-") // Replace & with 'dan'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const now = Date.now();

  // Check if IP is currently blocked
  const record = failedAttempts.get(ip);
  if (record && record.blockedUntil > now) {
    const minutesLeft = Math.ceil((record.blockedUntil - now) / 60000);
    return NextResponse.json(
      { message: `Terlalu banyak percobaan salah. Akses Anda diblokir sementara selama ${minutesLeft} menit.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { title, author, publishedAt, category, excerpt, content, imageName, imageBase64, passcode } = body;

    if (!title || !author || !publishedAt || !category || !excerpt || !content || !passcode || !imageBase64) {
      return NextResponse.json(
        { message: "Seluruh kolom form dan Gambar Sampul wajib diisi/diunggah." },
        { status: 400 }
      );
    }

    // Verify passcode (fallback to default "UKMI2026" if env is not set)
    const expectedPasscode = process.env.KODE_AKSES_PENGURUS || "UKMI2026";
    if (passcode !== expectedPasscode) {
      const newAttempts = (record?.count || 0) + 1;
      if (newAttempts >= 5) {
        failedAttempts.set(ip, { count: newAttempts, blockedUntil: now + 15 * 60 * 1000 });
        return NextResponse.json(
          { message: "Kode Akses salah 5 kali berturut-turut. Akses Anda diblokir selama 15 menit." },
          { status: 429 }
        );
      } else {
        failedAttempts.set(ip, { count: newAttempts, blockedUntil: 0 });
        return NextResponse.json(
          { message: `Kode Akses Pengurus tidak valid. Sisa percobaan: ${5 - newAttempts}` },
          { status: 401 }
        );
      }
    }

    // Passcode verified successfully
    failedAttempts.delete(ip);

    // Validate uploaded Image Data (Server-Side Hardening)
    let imageBuffer: Buffer | null = null;
    if (imageBase64) {
      const matches = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json(
          { message: "Format encoding gambar tidak valid." },
          { status: 400 }
        );
      }

      const mimeType = matches[1].toLowerCase();
      if (!ALLOWED_IMAGE_MIME_TYPES.includes(mimeType)) {
        return NextResponse.json(
          { message: "Format file tidak diizinkan. Hanya gambar JPG, PNG, GIF, dan WEBP yang diperbolehkan (SVG dan skrip tidak diizinkan)." },
          { status: 400 }
        );
      }

      imageBuffer = Buffer.from(matches[2], "base64");
      // Strict Server-Side Size Validation (Max 5MB)
      if (imageBuffer.length > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Ukuran gambar terlalu besar. Maksimal 5MB." },
          { status: 400 }
        );
      }
    }

    const token = process.env.SANITY_WRITE_TOKEN;

    if (!token) {
      console.warn("SANITY_WRITE_TOKEN is not configured in .env variables.");
      return NextResponse.json(
        { 
          message: "Fitur tulis artikel dinonaktifkan sementara karena server belum mengonfigurasi SANITY_WRITE_TOKEN di berkas .env." 
        },
        { status: 501 }
      );
    }

    // Initialize write client (CDN must be false for mutative operations)
    const writeClient = createClient({
      projectId: "ksc63oa8",
      dataset: "production",
      apiVersion: "2024-01-01",
      token: token,
      useCdn: false,
    });

    // Upload image asset to Sanity CDN if buffer exists
    let imageAssetRef: any = null;
    if (imageBuffer) {
      try {
        const uploadedAsset = await writeClient.assets.upload("image", imageBuffer, {
          filename: imageName || "uploaded-cover.jpg",
        });
        imageAssetRef = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: uploadedAsset._id,
          },
        };
      } catch (imgErr) {
        console.error("Gagal mengunggah gambar ke Sanity CDN:", imgErr);
      }
    }

    const slug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;

    // Prepare Sanity Article Document (creating as draft for moderation)
    const document: any = {
      _type: "article",
      _id: `drafts.${slug}`,
      title: title,
      slug: {
        _type: "slug",
        current: slug,
      },
      category: category,
      excerpt: excerpt,
      author: author,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      featured: false,
      tags: [category.toLowerCase()],
      ...(imageAssetRef ? { coverImage: imageAssetRef } : {}),
      content: content,
    };

    const createdDoc = await writeClient.createOrReplace(document);

    return NextResponse.json(
      { 
        message: "Artikel dan gambar berhasil dikirim ke moderasi.",
        id: createdDoc._id 
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Sanity post error:", err);
    return NextResponse.json(
      { message: `Gagal menyimpan ke database Sanity: ${err.message}` },
      { status: 500 }
    );
  }
}
