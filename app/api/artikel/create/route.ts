import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const failedAttempts = new Map<string, { count: number; blockedUntil: number }>();

function pruneExpiredAttempts() {
  const now = Date.now();
  for (const [ip, record] of failedAttempts.entries()) {
    if (record.blockedUntil > 0 && record.blockedUntil < now) {
      failedAttempts.delete(ip);
    }
  }
}

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

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-dan-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function POST(request: Request) {
  pruneExpiredAttempts();
  const ip = getClientIp(request);
  const now = Date.now();

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

    failedAttempts.delete(ip);

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

    const writeClient = createClient({
      projectId: "ksc63oa8",
      dataset: "production",
      apiVersion: "2024-01-01",
      token: token,
      useCdn: false,
    });

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
        id: createdDoc._id,
        slug: slug
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

export async function PATCH(request: Request) {
  pruneExpiredAttempts();
  const ip = getClientIp(request);
  const now = Date.now();

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
    const { slug, title, author, publishedAt, category, excerpt, content, imageName, imageBase64, passcode } = body;

    if (!slug || !title || !author || !publishedAt || !category || !excerpt || !content || !passcode) {
      return NextResponse.json(
        { message: "Slug dan seluruh field artikel wajib diisi." },
        { status: 400 }
      );
    }

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

    failedAttempts.delete(ip);

    const token = process.env.SANITY_WRITE_TOKEN;

    if (!token) {
      return NextResponse.json(
        { message: "SANITY_WRITE_TOKEN tidak dikonfigurasi." },
        { status: 501 }
      );
    }

    const writeClient = createClient({
      projectId: "ksc63oa8",
      dataset: "production",
      apiVersion: "2024-01-01",
      token: token,
      useCdn: false,
    });

    let imageAssetRef: any = undefined;
    if (imageBase64) {
      const matches = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1].toLowerCase();
        if (ALLOWED_IMAGE_MIME_TYPES.includes(mimeType)) {
          const imageBuffer = Buffer.from(matches[2], "base64");
          if (imageBuffer.length <= 5 * 1024 * 1024) {
            try {
              const uploadedAsset = await writeClient.assets.upload("image", imageBuffer, {
                filename: imageName || "updated-cover.jpg",
              });
              imageAssetRef = {
                _type: "image",
                asset: {
                  _type: "reference",
                  _ref: uploadedAsset._id,
                },
              };
            } catch (imgErr) {
              console.error("Gagal mengunggah gambar baru:", imgErr);
            }
          }
        }
      }
    }

    const updatePayload: any = {
      title,
      author,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      category,
      excerpt,
      content,
      tags: [category.toLowerCase()],
    };

    if (imageAssetRef) {
      updatePayload.coverImage = imageAssetRef;
    }

    const updatedDoc = await writeClient
      .patch(slug)
      .set(updatePayload)
      .commit();

    return NextResponse.json(
      { 
        message: "Artikel berhasil diperbarui.",
        id: updatedDoc._id
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Sanity patch error:", err);
    return NextResponse.json(
      { message: `Gagal memperbarui artikel: ${err.message}` },
      { status: 500 }
    );
  }
}
