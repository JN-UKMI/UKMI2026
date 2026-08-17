import { describe, expect, it } from "vitest";
import {
  ArticleCreateSchema,
  ArticleUpdateSchema,
  IsoDateSchema,
  KegiatanCreateSchema,
  MediaSpaceCreateSchema,
  SanityDocumentIdSchema,
  SlugSchema,
  TitipanSemangatCreateSchema,
  TitipanSemangatUpdateSchema,
  TitipanSemangatDeleteSchema,
} from "@/lib/schemas";

describe("SlugSchema", () => {
  it("accepts lowercase slugs with dashes and numbers", () => {
    expect(SlugSchema.safeParse("artikel-islami-2026").success).toBe(true);
  });

  it("rejects uppercase letters, spaces, and symbols", () => {
    expect(SlugSchema.safeParse("Artikel Islami!").success).toBe(false);
    expect(SlugSchema.safeParse("artikel_islami").success).toBe(false);
  });

  it("rejects empty and overlong slugs", () => {
    expect(SlugSchema.safeParse("").success).toBe(false);
    expect(SlugSchema.safeParse("a".repeat(121)).success).toBe(false);
  });
});

describe("IsoDateSchema", () => {
  it("accepts ISO date-only and full datetime forms", () => {
    expect(IsoDateSchema.safeParse("2026-07-24").success).toBe(true);
    expect(IsoDateSchema.safeParse("2026-07-24T10:30:00Z").success).toBe(true);
    expect(IsoDateSchema.safeParse("2026-07-24T10:30:00.000Z").success).toBe(true);
  });

  it("rejects non-ISO formats", () => {
    expect(IsoDateSchema.safeParse("24-07-2026").success).toBe(false);
    expect(IsoDateSchema.safeParse("kemarin").success).toBe(false);
    expect(IsoDateSchema.safeParse("2026/07/24").success).toBe(false);
  });
});

describe("SanityDocumentIdSchema", () => {
  it("accepts sanity-style ids", () => {
    expect(SanityDocumentIdSchema.safeParse("drafts.artikel-abc123").success).toBe(true);
  });

  it("rejects unsafe characters", () => {
    expect(SanityDocumentIdSchema.safeParse("drafts/artikel;DROP").success).toBe(false);
  });
});

describe("ArticleCreateSchema", () => {
  const valid = {
    title: "Judul Artikel",
    author: "Penulis",
    category: "Artikel Islami",
    excerpt: "Ringkasan singkat artikel.",
    content: "<p>Isi artikel</p>",
  };

  it("accepts a minimal valid payload", () => {
    const result = ArticleCreateSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts optional image fields with base64 data URI", () => {
    const result = ArticleCreateSchema.safeParse({
      ...valid,
      imageName: "thumb.webp",
      imageBase64: "data:image/webp;base64,AAAA",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid image base64 encoding", () => {
    const result = ArticleCreateSchema.safeParse({
      ...valid,
      imageBase64: "data:image/bmp;base64,AAAA",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown categories", () => {
    const result = ArticleCreateSchema.safeParse({
      ...valid,
      category: "Berita",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const { title: _title, ...withoutTitle } = valid;
    void _title;
    expect(ArticleCreateSchema.safeParse(withoutTitle).success).toBe(false);
  });

  it("rejects oversized content (payload-DOS guard)", () => {
    expect(
      ArticleCreateSchema.safeParse({ ...valid, content: "x".repeat(500_001) }).success
    ).toBe(false);
  });
});

describe("ArticleUpdateSchema", () => {
  const base = {
    id: "drafts.artikel-1",
    title: "Judul",
    category: "Kajian Islami",
    excerpt: "Ringkasan",
    content: "<p>Isi</p>",
  };

  it("accepts coverImage as URL, data URI, object, or null", () => {
    expect(
      ArticleUpdateSchema.safeParse({ ...base, coverImage: "https://cdn.example.com/a.webp" }).success
    ).toBe(true);
    expect(
      ArticleUpdateSchema.safeParse({ ...base, coverImage: "data:image/png;base64,AAAA" }).success
    ).toBe(true);
    expect(
      ArticleUpdateSchema.safeParse({ ...base, coverImage: { assetId: "image-abc" } }).success
    ).toBe(true);
    expect(ArticleUpdateSchema.safeParse({ ...base, coverImage: null }).success).toBe(true);
  });

  it("accepts optional publishedAt in ISO format", () => {
    expect(
      ArticleUpdateSchema.safeParse({ ...base, publishedAt: "2026-07-24T09:00:00.000Z" }).success
    ).toBe(true);
    expect(
      ArticleUpdateSchema.safeParse({ ...base, publishedAt: "24 Juli 2026" }).success
    ).toBe(false);
  });
});

describe("KegiatanCreateSchema", () => {
  const valid = {
    dayBadge: "24",
    monthBadge: "JUL",
    title: "Kajian Rutin",
    date: "Jumat, 24 Juli 2026",
    location: "Masjid UNS",
    description: "Kajian pekanan bersama.",
    instagramUrl: "",
  };

  it("accepts a valid event payload", () => {
    expect(KegiatanCreateSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects non-numeric dayBadge", () => {
    expect(KegiatanCreateSchema.safeParse({ ...valid, dayBadge: "dua-puluh" }).success).toBe(false);
  });

  it("rejects overlong monthBadge", () => {
    expect(KegiatanCreateSchema.safeParse({ ...valid, monthBadge: "SEPTEMBER-PANJANG" }).success).toBe(false);
  });

  it("accepts valid instagramUrl and rejects junk", () => {
    expect(
      KegiatanCreateSchema.safeParse({ ...valid, instagramUrl: "https://instagram.com/jnukmiuns" }).success
    ).toBe(true);
    expect(
      KegiatanCreateSchema.safeParse({ ...valid, instagramUrl: "javascript:alert(1)" }).success
    ).toBe(false);
  });
});

describe("MediaSpaceCreateSchema", () => {
  const base = { title: "Kegiatan Dakwah", description: "Dokumentasi kegiatan." };

  it("accepts valid http/https URL", () => {
    expect(
      MediaSpaceCreateSchema.safeParse({ ...base, instagramUrl: "https://www.instagram.com/p/xyz/" }).success
    ).toBe(true);
  });

  it("accepts empty string", () => {
    expect(MediaSpaceCreateSchema.safeParse({ ...base, instagramUrl: "" }).success).toBe(true);
  });

  it("rejects non-http protocols and malformed URLs", () => {
    expect(
      MediaSpaceCreateSchema.safeParse({ ...base, instagramUrl: "javascript:alert(1)" }).success
    ).toBe(false);
    expect(
      MediaSpaceCreateSchema.safeParse({ ...base, instagramUrl: "not-a-url" }).success
    ).toBe(false);
  });
});

describe("TitipanSemangatCreateSchema", () => {
  it("accepts valid name and message", () => {
    const valid = {
      name: "Akhi Fulan",
      message: "Semangat terus berdakwah dan menebar kebaikan!",
    };
    expect(TitipanSemangatCreateSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty name or message", () => {
    expect(TitipanSemangatCreateSchema.safeParse({ name: "", message: "Semangat!" }).success).toBe(false);
    expect(TitipanSemangatCreateSchema.safeParse({ name: "Fulan", message: "" }).success).toBe(false);
  });

  it("rejects overlong name or message", () => {
    expect(
      TitipanSemangatCreateSchema.safeParse({
        name: "a".repeat(81),
        message: "Semangat!",
      }).success
    ).toBe(false);
    expect(
      TitipanSemangatCreateSchema.safeParse({
        name: "Fulan",
        message: "a".repeat(301),
      }).success
    ).toBe(false);
  });
});

describe("TitipanSemangatUpdateSchema", () => {
  it("accepts valid id, name, and message", () => {
    expect(
      TitipanSemangatUpdateSchema.safeParse({
        id: "msg-123",
        name: "Fulan",
        message: "Pesan yang diperbarui",
      }).success
    ).toBe(true);
  });

  it("rejects missing id, empty name, or empty message", () => {
    expect(
      TitipanSemangatUpdateSchema.safeParse({
        id: "",
        name: "Fulan",
        message: "Semangat!",
      }).success
    ).toBe(false);
    expect(
      TitipanSemangatUpdateSchema.safeParse({
        id: "msg-123",
        name: "",
        message: "Semangat!",
      }).success
    ).toBe(false);
    expect(
      TitipanSemangatUpdateSchema.safeParse({
        id: "msg-123",
        name: "Fulan",
        message: "",
      }).success
    ).toBe(false);
  });
});

describe("TitipanSemangatDeleteSchema", () => {
  it("accepts valid non-empty id", () => {
    expect(TitipanSemangatDeleteSchema.safeParse({ id: "msg-123" }).success).toBe(true);
  });

  it("rejects empty id", () => {
    expect(TitipanSemangatDeleteSchema.safeParse({ id: "" }).success).toBe(false);
  });
});
