import { z } from "zod";

/**
 * Centralized zod schemas for API input validation.
 *
 * Design notes:
 * - Length caps guard against payload-DOS attacks.
 * - Regex formats prevent parameter pollution (slug chars, dates).
 * - Defaults match common patterns from existing wire format so callers
 *   don't have to change.
 */

// ── Shared atoms ───────────────────────────────────────────────
export const SlugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9\-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip");

export const IsoDateSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/,
    "Tanggal tidak valid (format ISO)"
  );

export const SanityDocumentIdSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9.\-_]+$/, "ID dokumen tidak valid");

const ImageBase64Schema = z
  .string()
  .regex(/^data:image\/(jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/, "Encoding gambar tidak valid");

export const ContentType = {
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
} as const;

export const ALLOWED_IMAGE_MIME_TYPES: string[] = Object.values(ContentType);

// ── Artikel create ──────────────────────────────────────────────
const ArticleContentShape = {
  title: z.string().min(1).max(200),
  author: z.string().min(1).max(100),
  category: z.enum(["Artikel Islami", "Kajian Islami", "Lainnya"]),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1).max(500_000),
  publishedAt: z.string().optional(),
  imageName: z.string().max(200).optional(),
  imageBase64: ImageBase64Schema.optional(),
};

export const ArticleCreateSchema = z.object(ArticleContentShape);

// ── Admin approve ──────────────────────────────────────────────
export const ApproveSchema = z.object({
  draftId: SanityDocumentIdSchema,
});

export const RejectSchema = z.object({
  draftId: SanityDocumentIdSchema,
});

// ── Admin articles manage ──────────────────────────────────────
export const ManageGetQuerySchema = z.object({
  id: SanityDocumentIdSchema,
});

export const ArticleUpdateSchema = z.object({
  id: SanityDocumentIdSchema,
  title: z.string().min(1).max(200),
  category: z.enum(["Artikel Islami", "Kajian Islami", "Lainnya"]),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1).max(500_000),
  author: z.string().max(100).optional(),
  publishedAt: IsoDateSchema.optional(),
  coverImage: z
    .union([
      z.null(),
      z.string().url().or(z.string().startsWith("data:image/")),
      z.object({
        assetId: z.string().min(1).max(200),
      }),
    ])
    .optional(),
});

export const ArticleDeleteSchema = z.object({
  id: SanityDocumentIdSchema,
});

// ── Kegiatan (event) ───────────────────────────────────────────

const BadgeFields = {
  dayBadge: z.string().min(1).max(8).regex(/^\d{1,2}$/, "Day badge harus angka 1-2 digit"),
  monthBadge: z.string().min(1).max(12),
  title: z.string().min(1).max(200),
  // Tanggal disimpan sebagai teks tampilan Indonesia (mis. "Jumat, 24 Juli 2026")
  // agar konsisten dengan data existing. Badge angka/bulan terpisah (dayBadge/monthBadge).
  // Regex longgar tetap membatasi karakter (huruf/angka/tanda baca umum).
  date: z.string().min(1).max(120).regex(
    /^[A-Za-z0-9,·\s.\-:/]+$/,
    "Format tanggal tidak valid"
  ),
  location: z.string().max(200).optional(),
  description: z.string().min(1).max(2000),
  // Wajib http/https - zod `url()` menerima protocol apa pun (mis. javascript:),
  // jadi perlu refine eksplisit seperti MediaSpaceCreateSchema.
  instagramUrl: z
    .string()
    .refine(
      (v) => {
        if (v === "") return true;
        try {
          const u = new URL(v);
          return u.protocol === "http:" || u.protocol === "https:";
        } catch {
          return false;
        }
      },
      "URL Instagram harus http/https yang valid"
    )
    .optional()
    .or(z.literal("")),
};

export const KegiatanCreateSchema = z.object(BadgeFields);
export const KegiatanUpdateSchema = z.object({
  id: z.string().min(1).max(200),
  ...BadgeFields,
});

export const KegiatanDeleteQuerySchema = z.object({
  id: z.string().min(1).max(200),
});

// ── Media Space (bento grid beranda) ────────────────────────────────
export const MediaSpaceCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  instagramUrl: z
    .string()
    .refine(
      (v) => {
        if (v === "") return true;
        try {
          const u = new URL(v);
          return u.protocol === "http:" || u.protocol === "https:";
        } catch {
          return false;
        }
      },
      "URL Instagram harus http/https yang valid"
    )
    .optional()
    .or(z.literal("")),
});

export const MediaSpaceUpdateSchema = MediaSpaceCreateSchema.extend({
  id: z.string().min(1).max(200),
});

export const MediaSpaceDeleteQuerySchema = z.object({
  id: z.string().min(1).max(200),
});

export type MediaSpaceCreatePayload = z.infer<typeof MediaSpaceCreateSchema>;

// ── Kalender UKMI (Supabase) ──────────────────────────────────
export const KalenderEventCreateSchema = z.object({
  title: z.string().min(1, "Judul agenda wajib diisi").max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  time: z.string().max(100).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  type: z.enum(["Agenda UKMI", "Puasa Sunnah"]).default("Agenda UKMI"),
  bidang: z.string().max(100).optional().or(z.literal("")),
  description: z.string().max(1000).optional().or(z.literal("")),
});

export const KalenderEventUpdateSchema = KalenderEventCreateSchema.extend({
  id: z.string().min(1).max(100),
});

export const KalenderEventDeleteSchema = z.object({
  id: z.string().min(1).max(100),
});

// ── Admin Emails Allowlist (Supabase) ──────────────────────────
export const AdminEmailCreateSchema = z.object({
  email: z.string().email("Format email tidak valid").max(100),
  name: z.string().max(100).optional().or(z.literal("")),
});

export const AdminEmailUpdateSchema = z.object({
  id: z.string().min(1).max(100),
  email: z.string().email("Format email tidak valid").max(100),
  name: z.string().max(100).optional().or(z.literal("")),
});

export const AdminEmailDeleteSchema = z.object({
  id: z.string().min(1).max(100),
});

// ── Titipan Semangat (Pesan Komunitas) ──────────────────────────
export const TitipanSemangatCreateSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(80, "Nama maksimal 80 karakter"),
  message: z.string().min(2, "Pesan minimal 2 karakter").max(300, "Pesan maksimal 300 karakter"),
});

export const TitipanSemangatUpdateSchema = z.object({
  id: z.string().min(1, "ID pesan wajib diisi"),
  name: z.string().min(1, "Nama wajib diisi").max(80, "Nama maksimal 80 karakter"),
  message: z.string().min(2, "Pesan minimal 2 karakter").max(300, "Pesan maksimal 300 karakter"),
});

export const TitipanSemangatDeleteSchema = z.object({
  id: z.string().min(1, "ID pesan wajib diisi"),
});

// ── Shortlink Generator ─────────────────────────────────────────
export const RESERVED_SLUGS = new Set([
  "403",
  "404",
  "admin",
  "al-kahfi",
  "al-masurat",
  "al-matsurat",
  "api",
  "artikel",
  "bidang",
  "buku-ukmi",
  "doa-doa",
  "feed.xml",
  "kabinet",
  "kontak",
  "ldf",
  "loading",
  "login",
  "offline",
  "oki",
  "partner",
  "partnership",
  "s",
  "tentang",
  "ukmi-store",
  "manifest",
  "manifest.webmanifest",
  "robots.txt",
  "sitemap",
  "sitemap.xml",
  "sw.js",
  "favicon.ico",
]);

export const ShortlinkCreateSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(80, "Slug maksimal 80 karakter")
    .regex(/^[a-zA-Z0-9_-]+$/, "Slug hanya boleh berisi huruf, angka, tanda strip (-), dan garis bawah (_)")
    .refine((val) => !RESERVED_SLUGS.has(val.toLowerCase()), {
      message: "Slug ini merupakan nama halaman sistem yang dilindungi dan tidak dapat digunakan.",
    }),
  target_url: z
    .string()
    .url("Format URL target tidak valid (harus diawali http:// atau https://)")
    .max(2048, "URL target maksimal 2048 karakter"),
  title: z.string().max(150, "Judul/keterangan maksimal 150 karakter").optional().or(z.literal("")),
});

export const ShortlinkUpdateSchema = z.object({
  id: z.string().min(1, "ID shortlink wajib diisi"),
  slug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(80, "Slug maksimal 80 karakter")
    .regex(/^[a-zA-Z0-9_-]+$/, "Slug hanya boleh berisi huruf, angka, tanda strip (-), dan garis bawah (_)")
    .refine((val) => !RESERVED_SLUGS.has(val.toLowerCase()), {
      message: "Slug ini merupakan nama halaman sistem yang dilindungi dan tidak dapat digunakan.",
    }),
  target_url: z
    .string()
    .url("Format URL target tidak valid (harus diawali http:// atau https://)")
    .max(2048, "URL target maksimal 2048 karakter"),
  title: z.string().max(150, "Judul/keterangan maksimal 150 karakter").optional().or(z.literal("")),
});

export const ShortlinkDeleteSchema = z.object({
  id: z.string().min(1, "ID shortlink wajib diisi"),
});

// Type helpers so server code can `z.infer<typeof FooSchema>`
export type ArticleCreatePayload = z.infer<typeof ArticleCreateSchema>;
export type ArticleUpdatePayload = z.infer<typeof ArticleUpdateSchema>;
export type KegiatanCreatePayload = z.infer<typeof KegiatanCreateSchema>;
export type KegiatanUpdatePayload = z.infer<typeof KegiatanUpdateSchema>;
export type KalenderEventCreatePayload = z.infer<typeof KalenderEventCreateSchema>;
export type KalenderEventUpdatePayload = z.infer<typeof KalenderEventUpdateSchema>;
export type AdminEmailCreatePayload = z.infer<typeof AdminEmailCreateSchema>;
export type AdminEmailUpdatePayload = z.infer<typeof AdminEmailUpdateSchema>;
export type TitipanSemangatCreatePayload = z.infer<typeof TitipanSemangatCreateSchema>;
export type TitipanSemangatUpdatePayload = z.infer<typeof TitipanSemangatUpdateSchema>;
export type TitipanSemangatDeletePayload = z.infer<typeof TitipanSemangatDeleteSchema>;
export type ShortlinkCreatePayload = z.infer<typeof ShortlinkCreateSchema>;
export type ShortlinkUpdatePayload = z.infer<typeof ShortlinkUpdateSchema>;
export type ShortlinkDeletePayload = z.infer<typeof ShortlinkDeleteSchema>;


