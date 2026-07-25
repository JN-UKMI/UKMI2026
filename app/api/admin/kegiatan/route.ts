import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createClient } from "next-sanity";
import { KegiatanSeruItem } from "@/lib/types";

const eventsFilePath = path.join(process.cwd(), "content", "kegiatan-seru", "events.json");

function getSanityWriteClient() {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) return null;
  return createClient({
    projectId: "ksc63oa8",
    dataset: "production",
    apiVersion: "2024-01-01",
    token: token,
    useCdn: false,
  });
}

// Helper read local events
async function readEvents(): Promise<KegiatanSeruItem[]> {
  try {
    const raw = await fs.readFile(eventsFilePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Helper write local events
async function writeEvents(events: KegiatanSeruItem[]) {
  await fs.mkdir(path.dirname(eventsFilePath), { recursive: true });
  await fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2), "utf-8");
}

// GET: Fetch all active events (from Sanity if available, else local)
export async function GET() {
  const sanityClient = getSanityWriteClient();
  if (sanityClient) {
    try {
      const sanityEvents = await sanityClient.fetch(`*[_type == "kegiatan"] | order(createdAt desc) {
        "id": _id,
        title,
        date,
        dayBadge,
        monthBadge,
        location,
        description,
        "posterUrl": poster.asset->url,
        instagramUrl,
        createdAt
      }`);
      return NextResponse.json({ events: sanityEvents });
    } catch {}
  }

  const events = await readEvents();
  return NextResponse.json({ events });
}

// POST: Add new event (With Sanity upload support & local fallback)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const dayBadge = formData.get("dayBadge") as string;
    const monthBadge = formData.get("monthBadge") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const instagramUrl = formData.get("instagramUrl") as string;
    const posterFile = formData.get("poster") as File | null;

    if (!title || !date || !dayBadge || !monthBadge || !description) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi!" },
        { status: 400 }
      );
    }

    const sanityClient = getSanityWriteClient();

    // Sanity cloud storage flow
    if (sanityClient) {
      let imageAsset = null;
      if (posterFile && posterFile.size > 0) {
        const buffer = Buffer.from(await posterFile.arrayBuffer());
        imageAsset = await sanityClient.assets.upload("image", buffer, {
          filename: posterFile.name || "poster.jpg",
        });
      }

      const doc = {
        _type: "kegiatan",
        title,
        date,
        dayBadge: dayBadge.trim(),
        monthBadge: monthBadge.trim().toUpperCase(),
        location: location || "Universitas Sebelas Maret",
        description,
        instagramUrl: instagramUrl || "https://www.instagram.com/jnukmiuns/",
        createdAt: new Date().toISOString(),
        ...(imageAsset
          ? {
              poster: {
                _type: "image",
                asset: { _type: "reference", _ref: imageAsset._id },
              },
            }
          : {}),
      };

      const createdDoc = await sanityClient.create(doc);
      return NextResponse.json({
        message: "Kegiatan seru berhasil ditambahkan ke Sanity CMS Cloud!",
        event: createdDoc,
      });
    }

    // Local JSON fallback flow
    let posterUrl = "/placeholder.png";

    if (posterFile && posterFile.size > 0) {
      const buffer = Buffer.from(await posterFile.arrayBuffer());
      const ext = path.extname(posterFile.name) || ".jpg";
      const filename = `event-${Date.now()}${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "events");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      posterUrl = `/events/${filename}`;
    }

    const newEvent: KegiatanSeruItem = {
      id: `event-${Date.now()}`,
      title,
      date,
      dayBadge: dayBadge.trim(),
      monthBadge: monthBadge.trim().toUpperCase(),
      location: location || "Universitas Sebelas Maret",
      description,
      posterUrl,
      instagramUrl: instagramUrl || "https://www.instagram.com/jnukmiuns/",
      createdAt: new Date().toISOString(),
    };

    const events = await readEvents();
    events.unshift(newEvent);
    await writeEvents(events);

    return NextResponse.json({
      message: "Kegiatan seru berhasil ditambahkan!",
      event: newEvent,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Gagal menyimpan kegiatan baru." },
      { status: 500 }
    );
  }
}

// PUT: Edit existing event
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const dayBadge = formData.get("dayBadge") as string;
    const monthBadge = formData.get("monthBadge") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const instagramUrl = formData.get("instagramUrl") as string;
    const posterFile = formData.get("poster") as File | null;

    if (!id || !title || !date || !dayBadge || !monthBadge || !description) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi!" },
        { status: 400 }
      );
    }

    const sanityClient = getSanityWriteClient();

    // Sanity cloud edit flow
    if (sanityClient && !id.startsWith("event-")) {
      let imageAsset = null;
      if (posterFile && posterFile.size > 0) {
        const buffer = Buffer.from(await posterFile.arrayBuffer());
        imageAsset = await sanityClient.assets.upload("image", buffer, {
          filename: posterFile.name || "poster.jpg",
        });
      }

      const patchData: any = {
        title,
        date,
        dayBadge: dayBadge.trim(),
        monthBadge: monthBadge.trim().toUpperCase(),
        location: location || "Universitas Sebelas Maret",
        description,
        instagramUrl: instagramUrl || "https://www.instagram.com/jnukmiuns/",
      };

      if (imageAsset) {
        patchData.poster = {
          _type: "image",
          asset: { _type: "reference", _ref: imageAsset._id },
        };
      }

      const updated = await sanityClient.patch(id).set(patchData).commit();
      return NextResponse.json({
        message: "Kegiatan seru berhasil diperbarui di Sanity CMS Cloud!",
        event: updated,
      });
    }

    // Local JSON edit flow
    let events = await readEvents();
    const existingIndex = events.findIndex((e) => e.id === id);

    if (existingIndex === -1) {
      return NextResponse.json(
        { message: "Kegiatan tidak ditemukan." },
        { status: 404 }
      );
    }

    let posterUrl = events[existingIndex].posterUrl;

    if (posterFile && posterFile.size > 0) {
      const buffer = Buffer.from(await posterFile.arrayBuffer());
      const ext = path.extname(posterFile.name) || ".jpg";
      const filename = `event-${Date.now()}${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "events");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      posterUrl = `/events/${filename}`;
    }

    events[existingIndex] = {
      ...events[existingIndex],
      title,
      date,
      dayBadge: dayBadge.trim(),
      monthBadge: monthBadge.trim().toUpperCase(),
      location: location || "Universitas Sebelas Maret",
      description,
      posterUrl,
      instagramUrl: instagramUrl || "https://www.instagram.com/jnukmiuns/",
    };

    await writeEvents(events);

    return NextResponse.json({
      message: "Kegiatan seru berhasil diperbarui!",
      event: events[existingIndex],
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Gagal memperbarui kegiatan." },
      { status: 500 }
    );
  }
}

// DELETE: Remove event by id (Sanity + Local fallback)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID kegiatan tidak valid." },
        { status: 400 }
      );
    }

    const sanityClient = getSanityWriteClient();

    if (sanityClient && !id.startsWith("event-")) {
      await sanityClient.delete(id);
      return NextResponse.json({ message: "Kegiatan berhasil dihapus dari Sanity CMS Cloud." });
    }

    let events = await readEvents();
    const eventToDelete = events.find((e) => e.id === id);

    if (eventToDelete && eventToDelete.posterUrl.startsWith("/events/")) {
      try {
        const fileToDelete = path.join(process.cwd(), "public", eventToDelete.posterUrl);
        await fs.unlink(fileToDelete);
      } catch {}
    }

    events = events.filter((e) => e.id !== id);
    await writeEvents(events);

    return NextResponse.json({ message: "Kegiatan berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Gagal menghapus kegiatan." },
      { status: 500 }
    );
  }
}
