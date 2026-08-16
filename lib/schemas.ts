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
  // Wajib http/https — zod `url()` menerima protocol apa pun (mis. javascript:),
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

// Type helpers so server code can `z.infer<typeof FooSchema>`
export type ArticleCreatePayload = z.infer<typeof ArticleCreateSchema>;
export type ArticleUpdatePayload = z.infer<typeof ArticleUpdateSchema>;
export type KegiatanCreatePayload = z.infer<typeof KegiatanCreateSchema>;
export type KegiatanUpdatePayload = z.infer<typeof KegiatanUpdateSchema>;
export type KalenderEventCreatePayload = z.infer<typeof KalenderEventCreateSchema>;
export type KalenderEventUpdatePayload = z.infer<typeof KalenderEventUpdateSchema>;
export type AdminEmailCreatePayload = z.infer<typeof AdminEmailCreateSchema>;
export type AdminEmailUpdatePayload = z.infer<typeof AdminEmailUpdateSchema>;


