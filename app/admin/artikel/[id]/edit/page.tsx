"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArticleBody } from "@/components/article/ArticleBody";
import { portableTextToHtml } from "@/lib/utils";
import { urlFor } from "@/lib/sanity";
import NovelEditor from "@/components/editor/NovelEditor";
import {
  ArrowLeft,
  Eye,
  Edit,
  Save,
  Calendar,
  Tag,
  User,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

interface ArticleData {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: any;
  publishedAt: string;
  author?: string;
  coverImage?: any;
}

export default function AdminEditArticlePage() {
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit mode toggle
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Artikel Islami");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editAuthor, setEditAuthor] = useState("");

  // ── Fetch article by Sanity ID ──
  useEffect(() => {
    if (!id) return;

    async function fetchArticle() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/admin/articles/manage?id=${encodeURIComponent(id)}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Gagal mengambil data artikel.");
        }
        const data = await res.json();
        setArticle(data.article);
        // Init form fields
        setEditTitle(data.article.title);
        setEditCategory(data.article.category);
        setEditExcerpt(data.article.excerpt);
        setEditAuthor(data.article.author || "");

        // Convert content to HTML for NovelEditor
        const content = data.article.content;
        if (typeof content === "string") {
          setEditContent(content);
        } else if (Array.isArray(content)) {
          setEditContent(portableTextToHtml(content));
        } else {
          setEditContent("");
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat artikel.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  // ── Handle content change from NovelEditor ──
  const handleContentChange = useCallback((html: string) => {
    setEditContent(html);
  }, []);

  // ── Save updated article ──
  const handleSave = async () => {
    if (!article) return;

    // Validate required fields
    if (!editTitle.trim()) {
      setError("Judul artikel wajib diisi.");
      return;
    }
    if (!editExcerpt.trim()) {
      setError("Ringkasan / kutipan artikel wajib diisi.");
      return;
    }
    if (!editContent.trim()) {
      setError("Konten artikel tidak boleh kosong.");
      return;
    }

    setError("");
    setSuccessMsg("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/articles/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: article._id,
          title: editTitle,
          category: editCategory,
          excerpt: editExcerpt,
          content: editContent,
          author: editAuthor,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan artikel.");
      }

      setSuccessMsg("Artikel berhasil diperbarui!");
      // Update local article data
      setArticle((prev) =>
        prev
          ? { ...prev, title: editTitle, category: editCategory, excerpt: editExcerpt, content: editContent, author: editAuthor }
          : prev
      );
      setIsEditing(false);

      // Clear success after 4s
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Helper: resolve cover image URL ──
  const getCoverUrl = (): string => {
    if (!article?.coverImage) return "/placeholder.png";
    try {
      const img = article.coverImage;
      if (typeof img === "object" && img.asset) {
        return urlFor(img).url() || "/placeholder.png";
      }
      if (typeof img === "string" && img.trim() !== "") return img;
    } catch {}
    return "/placeholder.png";
  };

  // ── Loading State ──
  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-forest-600" />
          <span className="text-sm font-semibold">Memuat artikel...</span>
        </div>
      </div>
    );
  }

  // ── Error State ──
  if (!article && !loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <p className="text-red-600 font-bold">{error || "Artikel tidak ditemukan."}</p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Panel Admin
          </Link>
        </div>
      </div>
    );
  }

  // Guard: article is guaranteed non-null after this point
  if (!article || loading) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* ── Top Nav Bar ── */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-forest-600 dark:hover:text-lime transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Panel Admin
        </Link>

        <div className="flex items-center gap-3">
          {successMsg && (
            <span className="text-xs font-bold text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {successMsg}
            </span>
          )}
          {error && (
            <span className="text-xs font-bold text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </span>
          )}

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-forest-600 hover:bg-forest-800 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Artikel
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                  // Reset form to current article state
                  if (article) {
                    setEditTitle(article.title);
                    setEditCategory(article.category);
                    setEditExcerpt(article.excerpt);
                    setEditAuthor(article.author || "");
                    const c = article.content;
                    setEditContent(typeof c === "string" ? c : Array.isArray(c) ? portableTextToHtml(c) : "");
                  }
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-forest-600 hover:bg-forest-800 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Simpan
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Article Preview (like the public detail page) ── */}
      <article>
        {/* Cover Image */}
        <div className="relative h-[250px] md:h-[400px] w-full overflow-hidden bg-gray-200">
          <Image
            src={getCoverUrl()}
            alt={article.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10 md:py-14">
          {/* Meta Info */}
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-forest-50 border border-forest-150 rounded-full text-xs font-bold text-forest-600 mb-4 w-fit">
              <Tag className="w-3.5 h-3.5" />
              {isEditing ? (
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-forest-600 focus:outline-none cursor-pointer"
                >
                  <option value="Artikel Islami">Artikel Islami</option>
                  <option value="Kajian Islami">Kajian Islami</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              ) : (
                <span>{article.category}</span>
              )}
            </div>

            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-2xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight leading-tight bg-transparent border-b-2 border-dashed border-gray-300 focus:border-forest-600 focus:outline-none px-1 py-1"
              />
            ) : (
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight leading-tight">
                {article.title}
              </h1>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400">
              {article.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-forest-600" />
                  <time>
                    {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              )}
              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-forest-600" />
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    placeholder="Nama penulis"
                    className="bg-transparent border-b border-dashed border-gray-300 focus:border-forest-600 focus:outline-none text-xs font-semibold text-gray-500 w-32"
                  />
                </div>
              ) : (
                article.author && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-forest-600" />
                    <span>oleh {article.author}</span>
                  </div>
                )
              )}
              <Link
                href={`/artikel/${article.slug}`}
                target="_blank"
                className="flex items-center gap-1 text-forest-600 hover:underline ml-auto"
              >
                <Eye className="w-3.5 h-3.5" />
                Lihat publik
              </Link>
            </div>
          </header>

          {/* Excerpt */}
          {isEditing ? (
            <textarea
              value={editExcerpt}
              onChange={(e) => setEditExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-dashed border-gray-300 text-sm focus:border-forest-600 focus:outline-none transition-all font-medium text-gray-600 italic mb-6 bg-gray-50"
            />
          ) : (
            article.excerpt && (
              <div className="border-l-4 border-forest-600 bg-forest-50/20 px-5 py-3 rounded-r-xl italic text-sm text-gray-600 font-medium mb-8">
                &ldquo;{article.excerpt}&rdquo;
              </div>
            )
          )}

          {/* Content */}
          {isEditing ? (
            <div className="mt-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                ✏️ Konten Artikel — edit dengan editor di bawah
              </p>
              <NovelEditor
                initialContent={editContent}
                onChange={handleContentChange}
              />
            </div>
          ) : (
            <div className="prose prose-forest prose-lg max-w-none mb-12">
              <ArticleBody content={article.content} />
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
