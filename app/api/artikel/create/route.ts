import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

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
  try {
    const body = await request.json();
    const { title, author, category, excerpt, content, coverUrl } = body;

    if (!title || !author || !category || !excerpt || !content) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi kecuali URL Gambar." },
        { status: 400 }
      );
    }

    const token = process.env.SANITY_WRITE_TOKEN;

    if (!token) {
      // If token is missing, return a clear guidance message for configuration
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

    const slug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;

    // Prepare Sanity Article Document
    const document = {
      _type: "article",
      title: title,
      slug: {
        _type: "slug",
        current: slug,
      },
      category: category,
      excerpt: excerpt,
      author: author,
      publishedAt: new Date().toISOString(),
      featured: false, // Default to false for moderation review
      tags: [category.toLowerCase()],
      // If coverUrl is provided, we can pass it as a raw string or reference.
      // Since it's a URL, we store it in a custom text/string schema field or omit if not matching sanity standard image asset.
      // Let's store coverImage object. If not a sanity asset, we can store string.
      // For standard sanity images, normally we upload asset. We will handle coverUrl text/url or skip if Sanity enforces strict image types.
      ...(coverUrl ? { coverImageUrl: coverUrl } : {}),
      // Format content to basic Sanity Portable Text block
      content: [
        {
          _type: "block",
          style: "normal",
          children: [
            {
              _type: "span",
              text: content,
            },
          ],
          markDefs: [],
        },
      ],
    };

    const createdDoc = await writeClient.create(document);

    return NextResponse.json(
      { 
        message: "Artikel berhasil dikirim ke moderasi.",
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
