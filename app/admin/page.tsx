"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ArticleBody } from "@/components/article/ArticleBody";
import { urlFor } from "@/lib/sanity";
import {
  ArrowLeft,
  ShieldCheck,
  Check,
  Trash2,
  Calendar,
  User,
  Tag,
  FileText,
  Edit,
  Save,
  Pencil,
  X,
  LogOut,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface DraftArticle {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: any; // Can be portable text or string
  publishedAt: string;
  author?: string;
  coverImage?: any;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"moderasi" | "terbit" | "kegiatan">("moderasi");
  
  const [drafts, setDrafts] = useState<DraftArticle[]>([]);
  const [publishedArticles, setPublishedArticles] = useState<DraftArticle[]>([]);
  const [publishedPage, setPublishedPage] = useState(1);
  const [kegiatanList, setKegiatanList] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Detail & Edit Modals State
  const [selectedArticle, setSelectedArticle] = useState<DraftArticle | null>(null);
  const [editArticle, setEditArticle] = useState<DraftArticle | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Artikel Islami");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContentText, setEditContentText] = useState("");

  // Form State for Kegiatan Seru
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDayBadge, setEventDayBadge] = useState("");
  const [eventMonthBadge, setEventMonthBadge] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventInstagramUrl, setEventInstagramUrl] = useState("");
  const [eventPosterFile, setEventPosterFile] = useState<File | null>(null);
  const [eventPosterPreview, setEventPosterPreview] = useState<string | null>(null);
  const [eventSubmitting, setEventSubmitting] = useState(false);

  // Fetch drafts, published articles, and kegiatan on mount
  useEffect(() => {
    fetchDrafts();
    fetchPublishedArticles();
    fetchKegiatan();
  }, []);

  async function fetchKegiatan() {
    try {
      const res = await fetch("/api/admin/kegiatan");
      if (res.ok) {
        const data = await res.json();
        setKegiatanList(data.events || []);
      }
    } catch {}
  }

  const startEditKegiatan = (item: any) => {
    setEditingEventId(item.id);
    setEventTitle(item.title || "");
    setEventDate(item.date || "");
    setEventDayBadge(item.dayBadge || "");
    setEventMonthBadge(item.monthBadge || "");
    setEventLocation(item.location || "");
    setEventDescription(item.description || "");
    setEventInstagramUrl(item.instagramUrl || "");
    setEventPosterFile(null);
    setEventPosterPreview(item.posterUrl || null);
  };

  const cancelEditKegiatan = () => {
    setEditingEventId(null);
    setEventTitle("");
    setEventDate("");
    setEventDayBadge("");
    setEventMonthBadge("");
    setEventLocation("");
    setEventDescription("");
    setEventInstagramUrl("");
    setEventPosterFile(null);
    setEventPosterPreview(null);
  };

  const handleAddKegiatan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setEventSubmitting(true);

    try {
      const formData = new FormData();
      if (editingEventId) {
        formData.append("id", editingEventId);
      }
      formData.append("title", eventTitle);
      formData.append("date", eventDate);
      formData.append("dayBadge", eventDayBadge);
      formData.append("monthBadge", eventMonthBadge);
      formData.append("location", eventLocation);
      formData.append("description", eventDescription);
      formData.append("instagramUrl", eventInstagramUrl);
      if (eventPosterFile) {
        formData.append("poster", eventPosterFile);
      }

      const res = await fetch("/api/admin/kegiatan", {
        method: editingEventId ? "PUT" : "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan kegiatan.");
      }

      setSuccessMsg(data.message || (editingEventId ? "Event Terdekat berhasil diperbarui!" : "Event Terdekat berhasil ditambahkan!"));
      cancelEditKegiatan();
      fetchKegiatan();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEventSubmitting(false);
    }
  };

  const handleDeleteKegiatan = async (eventId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) return;
    setError("");
    setSuccessMsg("");
    setActionLoadingId(eventId);

    try {
      const res = await fetch(`/api/admin/kegiatan?id=${eventId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menghapus kegiatan.");
      }

      setSuccessMsg(data.message || "Kegiatan berhasil dihapus.");
      setKegiatanList((prev) => prev.filter((item) => item.id !== eventId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  async function fetchDrafts() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/drafts");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal membaca antrean moderasi.");
      }

      setDrafts(data.drafts || []);
    } catch (err: any) {
      setError(err.message || "Gagal memproses data draf.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPublishedArticles() {
    try {
      const res = await fetch("/api/admin/articles");
      const data = await res.json();
      if (res.ok) {
        setPublishedArticles(data.articles || []);
      }
    } catch {}
  }

  const handleApprove = async (draftId: string) => {
    setError("");
    setSuccessMsg("");
    setActionLoadingId(draftId);

    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mempublikasikan artikel.");
      }

      setSuccessMsg(data.message || "Artikel berhasil dipublikasikan!");
      setDrafts((prev) => prev.filter((d) => d._id !== draftId));
      fetchPublishedArticles();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (draftId: string) => {
    if (!confirm("Apakah Anda yakin ingin menolak & menghapus draf artikel ini?")) return;
    setError("");
    setSuccessMsg("");
    setActionLoadingId(draftId);

    try {
      const res = await fetch("/api/admin/approve", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menolak draf artikel.");
      }

      setSuccessMsg(data.message || "Artikel berhasil ditolak & dihapus.");
      setDrafts((prev) => prev.filter((d) => d._id !== draftId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeletePublished = async (articleId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel yang sudah terbit ini?")) return;
    setError("");
    setSuccessMsg("");
    setActionLoadingId(articleId);

    try {
      const res = await fetch("/api/admin/articles/manage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: articleId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menghapus artikel.");
      }

      setSuccessMsg(data.message || "Artikel berhasil dihapus.");
      setPublishedArticles((prev) => prev.filter((a) => a._id !== articleId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- legacy modal retained until admin UI consolidation
  const openEditModal = (article: DraftArticle) => {
    setEditArticle(article);
    setEditTitle(article.title);
    setEditCategory(article.category);
    setEditExcerpt(article.excerpt);
    
    // Parse portable text to plain text for simple editor if it is structured
    if (typeof article.content === "string") {
      setEditContentText(article.content);
    } else if (Array.isArray(article.content)) {
      const plain = article.content
        .map((block: any) => block.children?.map((c: any) => c.text).join("") || "")
        .join("\n\n");
      setEditContentText(plain);
    } else {
      setEditContentText("");
    }
  };

  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editArticle) return;
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // Re-structure to portable text format or keep string
      let structuredContent: any = editContentText;
      if (Array.isArray(editArticle.content)) {
        structuredContent = editContentText.split("\n\n").map((para) => ({
          _type: "block",
          style: "normal",
          children: [{ _type: "span", text: para }],
        }));
      }

      const res = await fetch("/api/admin/articles/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editArticle._id,
          title: editTitle,
          category: editCategory,
          excerpt: editExcerpt,
          content: structuredContent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal memperbarui artikel.");
      }

      setSuccessMsg("Artikel berhasil diperbarui!");
      setEditArticle(null);
      
      // Refresh local lists
      fetchDrafts();
      fetchPublishedArticles();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- legacy modal renderer retained with the modal
  const renderContentText = (content: any) => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content.map((block: any, idx) => {
        const text = block.children?.map((c: any) => c.text).join("") || "";
        if (block.style === "h2") {
          return <h2 key={idx} className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">{text}</h2>;
        }
        if (block.style === "h3") {
          return <h3 key={idx} className="text-lg font-bold text-gray-900 dark:text-white mt-3 mb-1.5">{text}</h3>;
        }
        return <p key={idx} className="my-2.5 text-gray-700 dark:text-gray-200 leading-relaxed">{text}</p>;
      });
    }
    return "";
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12 px-4 md:px-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header Toolbar & User Profile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <TransitionLink
            href="/artikel"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-forest-600 dark:hover:text-lime transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Artikel
          </TransitionLink>

          {session?.user && (
            <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-2 pl-3.5 shadow-xs">
              {session.user.image && (
                // eslint-disable-next-line @next/next/no-img-element -- OAuth avatar URL is runtime data
                <img
                  src={session.user.image}
                  alt={session.user.name || "Avatar"}
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 shrink-0"
                />
              )}
              <div className="text-left leading-tight pr-2">
                <p className="text-xs font-black text-gray-900 dark:text-white truncate">
                  {session.user.name}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                  {session.user.email}
                </p>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-3 py-1.5 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ml-1"
                title="Keluar Sesi Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar
              </button>
            </div>
          )}
        </div>

        {/* Panel Title */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-800 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
          <div>
            <h1 className="text-2xl font-black text-forest-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-forest-600 animate-pulse" />
              Panel Moderasi & Pengelolaan
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
              Setujui draf artikel yang tertunda, or kelola dan edit artikel yang telah terbit secara langsung.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 mb-8">
          <button
            onClick={() => setActiveTab("moderasi")}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "moderasi"
                ? "border-forest-600 text-forest-900 dark:text-lime dark:border-lime"
                : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <FileText className="w-4 h-4" />
            Antrean Draf ({drafts.length})
          </button>
          <button
            onClick={() => setActiveTab("terbit")}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "terbit"
                ? "border-forest-600 text-forest-900 dark:text-lime dark:border-lime"
                : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Check className="w-4 h-4" />
            Artikel Terbit ({publishedArticles.length})
          </button>
          <button
            onClick={() => setActiveTab("kegiatan")}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "kegiatan"
                ? "border-forest-600 text-forest-900 dark:text-lime"
                : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Event Terdekat ({kegiatanList.length})
          </button>
        </div>

        {/* Notification alerts */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-xs font-bold rounded-r-lg">
            ✅ {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg">
            ⚠️ Error: {error}
          </div>
        )}

        {/* Tab 1: Moderasi Draf */}
        {activeTab === "moderasi" && (
          <div className="space-y-6">
            {drafts.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 shadow-md border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center justify-center transition-colors">
                <span className="text-5xl mb-4">🎉</span>
                <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                  Antrean Kosong!
                </h2>
                <p className="text-gray-400 dark:text-gray-500 text-xs max-w-sm leading-relaxed">
                  Semua draf artikel kontributor telah ditinjau dan dipublikasikan. Tidak ada antrean tertunda saat ini.
                </p>
              </div>
            ) : (
              drafts.map((draft) => (
                <div
                  key={draft._id}
                  className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="flex-1 space-y-3.5">
                    {/* Category Badge & Date */}
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 bg-forest-50 border border-forest-150 rounded text-[10px] font-bold text-forest-600 uppercase tracking-wide">
                        {draft.category}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-forest-600" />
                        {new Date(draft.publishedAt).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {draft.author && (
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-forest-600" />
                          oleh {draft.author}
                        </span>
                      )}
                    </div>

                    {/* Title & Excerpt */}
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                        {draft.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                        {draft.excerpt}
                      </p>
                    </div>

                    {/* View Full Content link */}
                    <a
                      href={`/artikel/${draft.slug}?preview=true&draft=true&draftId=${draft._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-forest-600 font-bold hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Lihat Detail & Preview Isi Artikel (Halaman Baru)
                    </a>
                  </div>

                  {/* Actions Toolbar */}                    <div className="flex md:flex-col items-center justify-end gap-2.5 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 dark:border-gray-800">
                    <TransitionLink
                      href={`/admin/artikel/${encodeURIComponent(draft._id)}/edit`}
                      className="flex-1 md:flex-none w-full px-4 py-2 bg-forest-600 hover:bg-forest-800 text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Artikel
                    </TransitionLink>

                    <button
                      disabled={actionLoadingId !== null}
                      onClick={() => handleApprove(draft._id)}
                      className="flex-1 md:flex-none w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Setujui
                    </button>

                    <button
                      disabled={actionLoadingId !== null}
                      onClick={() => handleReject(draft._id)}
                      className="flex-1 md:flex-none w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold transition-all border border-gray-200 dark:border-gray-700 hover:border-red-100 dark:hover:border-red-800 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Tolak & Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Artikel Terbit (Manage/Edit/Delete) */}
        {activeTab === "terbit" && (() => {
          const ITEMS_PER_PAGE = 10;
          const totalPages = Math.ceil(publishedArticles.length / ITEMS_PER_PAGE) || 1;
          const currentPage = Math.min(publishedPage, totalPages);
          const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
          const currentArticles = publishedArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

          return (
            <div className="space-y-6">
              {publishedArticles.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 shadow-md border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center justify-center transition-colors">
                  <span className="text-5xl mb-4">📚</span>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                    Belum ada artikel terbit
                  </h2>
                  <p className="text-gray-400 dark:text-gray-500 text-xs max-w-sm leading-relaxed">
                    Tidak ditemukan artikel yang dipublikasikan di database Sanity.
                  </p>
                </div>
              ) : (
                <>
                  {currentArticles.map((article) => (
                    <div
                      key={article._id}
                      className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between gap-6"
                    >
                      <div className="flex-1 space-y-3.5">
                        {/* Category Badge & Date */}
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 bg-forest-50 border border-forest-150 rounded text-[10px] font-bold text-forest-600 uppercase tracking-wide">
                            {article.category}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-forest-600" />
                            {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          {article.author && (
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-forest-600" />
                              oleh {article.author}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            {article.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>

                        {/* Detail / Preview Link */}
                        <div className="flex gap-4">
                          <a
                            href={`/artikel/${article.slug}?preview=true`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-forest-600 font-bold hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Lihat Isi & Detail (Halaman Baru)
                          </a>
                        </div>
                      </div>

                      {/* Actions Toolbar */}
                      <div className="flex md:flex-col items-center justify-end gap-2.5 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 dark:border-gray-800">
                        <TransitionLink
                          href={`/admin/artikel/${encodeURIComponent(article._id)}/edit`}
                          className="flex-1 md:flex-none w-full px-4 py-2 bg-forest-600 hover:bg-forest-800 text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit Artikel
                        </TransitionLink>

                        <button
                          disabled={actionLoadingId !== null}
                          onClick={() => handleDeletePublished(article._id)}
                          className="flex-1 md:flex-none w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold transition-all border border-gray-200 dark:border-gray-700 hover:border-red-100 dark:hover:border-red-800 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus Terbitan
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, publishedArticles.length)} dari {publishedArticles.length} artikel terbit
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPublishedPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                          aria-label="Halaman sebelumnya"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {Array.from({ length: totalPages }).map((_, idx) => {
                          const pageNum = idx + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPublishedPage(pageNum)}
                              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                currentPage === pageNum
                                  ? "bg-forest-600 text-white dark:bg-lime dark:text-forest-950 shadow-sm"
                                  : "border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setPublishedPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-forest-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                          aria-label="Halaman berikutnya"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })()}

        {/* Tab 3: Event Terdekat Management */}
        {activeTab === "kegiatan" && (
          <div className="space-y-10">
            {/* Form Tambah Kegiatan Baru */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-800 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-lime flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-forest-600 dark:text-lime" />
                  Tambah Event Terdekat Baru
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                  Isi formulir di bawah ini untuk menampilkan agenda event terdekat pada carousel beranda.
                </p>
              </div>

              <form onSubmit={handleAddKegiatan} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Judul Kegiatan */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Judul Kegiatan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="mis. Kuliah Kerja Dakwah (KKD)"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none transition-all font-semibold dark:bg-gray-950 dark:text-white"
                    />
                  </div>

                  {/* Badge Tanggal & Bulan */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Tgl Badge (Angka) & Bulan <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Tgl (mis. 17)"
                        value={eventDayBadge}
                        onChange={(e) => setEventDayBadge(e.target.value)}
                        className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none transition-all font-bold dark:bg-gray-950 dark:text-white"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Bulan (mis. JUL)"
                        value={eventMonthBadge}
                        onChange={(e) => setEventMonthBadge(e.target.value.toUpperCase())}
                        className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none transition-all font-bold uppercase dark:bg-gray-950 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Tanggal Lengkap Teks */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Hari & Tanggal Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="mis. Jumat, 17 Juli 2026"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none transition-all font-medium dark:bg-gray-950 dark:text-white"
                    />
                  </div>

                  {/* Lokasi */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Lokasi Kegiatan
                    </label>
                    <input
                      type="text"
                      placeholder="mis. Zoom Meeting / Masjid Kampus UNS"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none transition-all font-medium dark:bg-gray-950 dark:text-white"
                    />
                  </div>

                  {/* Link Instagram / Detail */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Link Detail / Instagram
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.instagram.com/p/..."
                      value={eventInstagramUrl}
                      onChange={(e) => setEventInstagramUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none transition-all font-medium dark:bg-gray-950 dark:text-white"
                    />
                  </div>
                </div>

                {/* Poster Image File Upload */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Upload Poster Event (Portrait 3:4 / 4:5)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEventPosterFile(file);
                        setEventPosterPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-forest-50 file:text-forest-700 hover:file:bg-forest-100 dark:file:bg-gray-800 dark:file:text-lime cursor-pointer"
                  />
                  {eventPosterPreview && (
                    <div className="mt-2 relative w-32 aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element -- blob preview is not supported by next/image */}
                      <img src={eventPosterPreview} alt="Preview Poster" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Deskripsi */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Deskripsi Singkat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tulis ringkasan singkat kegiatan ini..."
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none transition-all font-normal leading-relaxed dark:bg-gray-950 dark:text-white"
                  />
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="pt-2 flex justify-end gap-3">
                  {editingEventId && (
                    <button
                      type="button"
                      onClick={cancelEditKegiatan}
                      className="px-5 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold transition-all cursor-pointer"
                    >
                      Batal Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={eventSubmitting}
                    className="px-6 py-3 bg-forest-600 hover:bg-forest-800 dark:bg-lime dark:hover:bg-lime/90 dark:text-forest-950 text-white rounded-full text-xs font-bold transition-all inline-flex items-center gap-2 shadow-md cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {eventSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {editingEventId ? "Memperbarui Event..." : "Menyimpan Event..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingEventId ? "Simpan Perubahan Event" : "Tambah Kegiatan"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* List Active Events */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-forest-600 dark:text-lime" />
                Daftar Event Terdekat Aktif ({kegiatanList.length})
              </h3>

              {kegiatanList.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">Belum ada event terdekat yang ditambahkan.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kegiatanList.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm flex gap-4 items-center justify-between"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative w-16 aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element -- poster may be a local or runtime URL */}
                          <img src={item.posterUrl || "/placeholder.png"} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title}</h4>
                          <p className="text-xs text-forest-600 dark:text-lime font-medium mt-0.5">{item.date}</p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">{item.location}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => startEditKegiatan(item)}
                          className="p-2.5 bg-forest-50 hover:bg-forest-100 text-forest-700 dark:bg-forest-950 dark:hover:bg-forest-900 dark:text-lime rounded-xl transition-colors cursor-pointer"
                          title="Edit Kegiatan"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteKegiatan(item.id)}
                          disabled={actionLoadingId === item.id}
                          className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                          title="Hapus Kegiatan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: View Full Details (Styled like public article details page) */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col transition-colors">
              {/* Header Actions */}
              <div className="absolute right-6 top-6 z-10">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-white bg-black/40 hover:bg-black/60 border border-white/20 p-2 rounded-full transition-all cursor-pointer backdrop-blur-xs flex items-center justify-center"
                  title="Tutup Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <article className="w-full">
                {/* Cover Image Container */}
                <div className="relative h-[200px] md:h-[320px] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {(() => {
                    let imageSrc = "/placeholder.png";
                    const img: any = selectedArticle.coverImage;
                    if (img) {
                      if (typeof img === "object" && img.asset) {
                        try {
                          imageSrc = urlFor(img).url() || "/placeholder.png";
                        } catch {}
                      } else if (typeof img === "string" && img.trim() !== "") {
                        imageSrc = img;
                      }
                    }
                    return (
                      <Image
                        src={imageSrc}
                        alt={selectedArticle.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    );
                  })()}
                </div>

                <div className="px-6 py-8 md:px-12 md:py-10 max-w-4xl mx-auto">
                  {/* Category Badge & Meta Info */}
                  <header className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-forest-50 border border-forest-150 rounded-full text-[10px] font-bold text-forest-600 mb-3 w-fit uppercase tracking-wide">
                      <Tag className="w-3 h-3" />
                      <span>{selectedArticle.category}</span>
                    </div>

                    <h1 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tight leading-tight">
                      {selectedArticle.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-gray-400 dark:text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-forest-600" />
                        <time>
                          {new Date(selectedArticle.publishedAt).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                      {selectedArticle.author && (
                        <div className="flex items-center gap-1">
                          <Pencil className="w-3.5 h-3.5 text-forest-600" />
                          <span>oleh {selectedArticle.author}</span>
                        </div>
                      )}
                    </div>
                  </header>

                  {/* Excerpt Divider Box */}
                  <div className="border-l-4 border-forest-600 bg-forest-50/20 dark:bg-forest-950/30 px-4 py-3 rounded-r-xl italic text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium mb-6">
                    &ldquo;{selectedArticle.excerpt}&rdquo;
                  </div>

                  {/* Full Content Body Preview */}
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                    <ArticleBody content={selectedArticle.content} />
                  </div>

                  {/* Actions Footer */}
                  <div className="flex justify-end pt-8 mt-8 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-250 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-black transition-all cursor-pointer"
                >
                      Kembali ke Panel Admin
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        )}

        {/* Modal: Edit Article Form */}
        {editArticle && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative transition-colors">
              <button
                onClick={() => setEditArticle(null)}
                className="absolute right-6 top-6 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-black text-forest-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Edit className="w-5 h-5 text-forest-600" />
                Edit Detail Artikel
              </h2>

              <form onSubmit={handleUpdateArticle} className="space-y-5">
                {/* Title Input */}
                <div className="flex flex-col gap-1.5">                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Judul Artikel</label>                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm focus:border-forest-600 focus:outline-none transition-all font-semibold text-gray-900 dark:text-white"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Kategori</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none transition-all font-semibold bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                    >
                      <option value="Artikel Islami">Artikel Islami</option>
                      <option value="Kajian Islami">Kajian Islami</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="flex flex-col gap-1.5">                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Kutipan / Ringkasan</label>
                  <textarea
                    required
                    rows={2}
                    value={editExcerpt}
                    onChange={(e) => setEditExcerpt(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm bg-white dark:bg-gray-950 focus:border-forest-600 focus:outline-none transition-all font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                {/* Full Content */}
                <div className="flex flex-col gap-1.5">                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Isi Konten Artikel</label>
                  <textarea
                    required
                    rows={6}
                    value={editContentText}
                    onChange={(e) => setEditContentText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm bg-white dark:bg-gray-950 focus:border-forest-600 focus:outline-none transition-all font-medium leading-relaxed text-gray-900 dark:text-white"
                  />                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">Gunakan pemisah baris ganda (Enter dua kali) untuk memisahkan paragraf.</p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditArticle(null)}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold cursor-pointer"
                >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-forest-600 hover:bg-forest-800 text-white rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
