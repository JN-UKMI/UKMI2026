// Sanity client & GROQ query utilities
import { createClient } from "next-sanity"
import { createImageUrlBuilder } from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url"

import type { Article } from "./types"

export const client = createClient({
  projectId: "ksc63oa8",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// ── GROQ Queries ──────────────────────────────────────────────

/** Fetch all articles, newest first. Omits `content` for list views. */
export const ARTICLES_LIST_QUERY = /* groq */ `*[_type == "article"] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  category,
  coverImage,
  excerpt,
  publishedAt,
  author,
  tags,
  featured
}`

/** Fetch a single article by its slug (includes `content`). */
export const ARTICLE_BY_SLUG_QUERY = /* groq */ `*[_type == "article" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  category,
  coverImage,
  excerpt,
  content,
  publishedAt,
  author,
  tags,
  featured
}`

/** Fetch featured articles, newest first. */
export const FEATURED_ARTICLES_QUERY = /* groq */ `*[_type == "article" && featured == true] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  category,
  coverImage,
  excerpt,
  publishedAt,
  author,
  tags,
  featured
}`

/** Fetch articles by category, newest first. */
export const ARTICLES_BY_CATEGORY_QUERY = /* groq */ `*[_type == "article" && category == $category] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  category,
  coverImage,
  excerpt,
  publishedAt,
  author,
  tags,
  featured
}`

// ── Typed Results ─────────────────────────────────────────────

export type ArticleListItem = Pick<
  Article,
  | "title"
  | "slug"
  | "category"
  | "coverImage"
  | "excerpt"
  | "publishedAt"
  | "author"
  | "tags"
  | "featured"
>

export type ArticlesListResult = ArticleListItem[]

export type ArticleBySlugResult = Article | null

// ── Helper Wrappers ──────────────────────────────────────────────

export async function getArticles(): Promise<ArticlesListResult> {
  return client.fetch(ARTICLES_LIST_QUERY)
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleBySlugResult> {
  return client.fetch(ARTICLE_BY_SLUG_QUERY, { slug })
}

export async function getFeaturedArticles(): Promise<ArticlesListResult> {
  return client.fetch(FEATURED_ARTICLES_QUERY)
}

export async function getArticlesByCategory(
  category: Article["category"]
): Promise<ArticlesListResult> {
  return client.fetch(ARTICLES_BY_CATEGORY_QUERY, { category })
}

// ── Kegiatan Seru (Event Terdekat) Queries ──────────────────────

export const KEGIATAN_LIST_QUERY = /* groq */ `*[_type == "kegiatan"] | order(createdAt desc) {
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
}`

export async function getKegiatanSeruFromSanity(): Promise<import("./types").KegiatanSeruItem[]> {
  try {
    return await client.fetch(KEGIATAN_LIST_QUERY);
  } catch {
    return [];
  }
}

