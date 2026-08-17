"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ArticleCard } from "@/components/article/ArticleCard";
import type { ArticleListItem } from "@/lib/sanity";
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
  ChevronRight,
  Upload,
  GalleryVertical,
  ImagePlus,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Star,
  CalendarDays,
  KeyRound,
  MessageSquareHeart,
} from "lucide-react";
import { KalenderAdminTab } from "@/components/admin/KalenderAdminTab";
import { AdminsAdminTab } from "@/components/admin/AdminsAdminTab";
import { TitipanSemangatAdminTab } from "@/components/admin/TitipanSemangatAdminTab";

interface DraftArticle {
  _id: string;
  title: string;
  slug: string;
  category: ArticleListItem["category"];
  excerpt: string;
  content: any; // Can be portable text or string
  publishedAt: string;
  author?: string;
  coverImage?: any;
}

// ── Kegiatan date helpers ───────────────────────────────────────────
const MAX_POSTER_MB = 2;
const ALLOWED_POSTER_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/** Format ISO (2026-07-24) → tampilan Indonesia ("Jumat, 24 Juli 2026"). */
function formatIsoToDisplay(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Parse tampilan Indonesia ("Jumat, 24 Juli 2026") → ISO (2026-07-24). */
function parseDisplayDateToIso(display: string): string {
  const match = display.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!match) return "";
  const day = match[1].padStart(2, "0");
  const monthName = match[2].toLowerCase();
  const monthIdx = MONTHS_ID.findIndex(
    (m) =>
      m.toLowerCase() === monthName ||
      m.toLowerCase().slice(0, 3) === monthName.slice(0, 3)
  );
  if (monthIdx === -1) return "";
  return `${match[3]}-${String(monthIdx + 1).padStart(2, "0")}-${day}`;
}

/** Terima tampilan Indonesia ATAU ISO langsung (untuk mode edit). */
function toIsoFromDisplayOrIso(value: string): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value.trim())) return value.trim().slice(0, 10);
  return parseDisplayDateToIso(value);
}

/** Resolve URL thumbnail dari berbagai format coverImage Sanity (objek asset,
 *  objek {url|imageUrl|assetId}, atau string) → fallback placeholder. */
function resolveCoverUrl(coverImage: any): string {
  if (!coverImage) return "/placeholder.png";
  try {
    if (typeof coverImage === "object" && coverImage.asset) {
      return urlFor(coverImage).url() || "/placeholder.png";
    }
    if (typeof coverImage === "object") {
      const url = coverImage.url || coverImage.imageUrl;
      if (typeof url === "string" && url.trim() !== "") return url;
    }
    if (typeof coverImage === "string" && coverImage.trim() !== "") return coverImage;
  } catch {
    return "/placeholder.png";
  }
  return "/placeholder.png";
}

/** Compact page list — halaman tepi (1 & terakhir) + sekitar halaman aktif,
 *  sisanya diganti ellipsis. Contoh: 1 … 4 5 6 … 12 (pola pagination artikel). */
function getPageItems(total: number, current: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const items: (number | "ellipsis")[] = [];
  for (let p = 1; p <= total; p++) {
    const isEdge = p === 1 || p === total;
    const isNear = Math.abs(p - current) <= 1;
    if (isEdge || isNear) {
      items.push(p);
    } else if (items[items.length - 1] !== "ellipsis") {
      items.push("ellipsis");
    }
  }
  return items;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<
    "moderasi" | "terbit" | "kegiatan" | "media" | "kalender" | "admins" | "titipan"
  >("moderasi");
  
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
  const [eventDate, setEventDate] = useState(""); // Format tampilan: "Jumat, 24 Juli 2026"
  const [eventDateIso, setEventDateIso] = useState(""); // Value input kalender: "2026-07-24"
  const eventDateInputRef = useRef<HTMLInputElement>(null);
  const [eventDayBadge, setEventDayBadge] = useState("");
  const [eventMonthBadge, setEventMonthBadge] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventInstagramUrl, setEventInstagramUrl] = useState("");
  const [eventPosterFile, setEventPosterFile] = useState<File | null>(null);
  const [eventPosterPreview, setEventPosterPreview] = useState<string | null>(null);
  const [eventPosterOriginalUrl, setEventPosterOriginalUrl] = useState<string | null>(null);
  const [eventPosterObjectUrl, setEventPosterObjectUrl] = useState<string | null>(null);
  const [eventPosterDragOver, setEventPosterDragOver] = useState(false);
  const [eventSubmitting, setEventSubmitting] = useState(false);

  // Form State for Media Space
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaDescription, setMediaDescription] = useState("");
  const [mediaInstagramUrl, setMediaInstagramUrl] = useState("");
  const [mediaImageFile, setMediaImageFile] = useState<File | null>(null);
  const [mediaImagePreview, setMediaImagePreview] = useState<string | null>(null);
  const [mediaImageOriginalUrl, setMediaImageOriginalUrl] = useState<string | null>(null);
  const [mediaImageObjectUrl, setMediaImageObjectUrl] = useState<string | null>(null);
  const [mediaImageDragOver, setMediaImageDragOver] = useState(false);
  const [mediaSubmitting, setMediaSubmitting] = useState(false);

  // Fetch drafts, published articles, kegiatan, and media space on mount
  useEffect(() => {
    fetchDrafts();
    fetchPublishedArticles();
    fetchKegiatan();
    fetchMediaSpace();
  }, []);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(publishedArticles.length / 6));
    // Keep the current page valid after deletion or a refreshed article list.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clamp pagination after list size changes
    setPublishedPage((currentPage) => Math.min(currentPage, totalPages));
  }, [publishedArticles.length]);

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
    setEventDateIso(toIsoFromDisplayOrIso(item.date || ""));
    setEventDayBadge(item.dayBadge || "");
    setEventMonthBadge(item.monthBadge || "");
    setEventLocation(item.location || "");
    setEventDescription(item.description || "");
    setEventInstagramUrl(item.instagramUrl || "");
    // Reset poster state; simpan poster lama agar bisa dikembalikan saat Hapus
    if (eventPosterObjectUrl) URL.revokeObjectURL(eventPosterObjectUrl);
    setEventPosterObjectUrl(null);
    setEventPosterFile(null);
    setEventPosterOriginalUrl(item.posterUrl || null);
    setEventPosterPreview(item.posterUrl || null);
    setEventPosterDragOver(false);
  };

  const cancelEditKegiatan = () => {
    setEditingEventId(null);
    setEventTitle("");
    setEventDate("");
    setEventDateIso("");
    setEventDayBadge("");
    setEventMonthBadge("");
    setEventLocation("");
    setEventDescription("");
    setEventInstagramUrl("");
    if (eventPosterObjectUrl) URL.revokeObjectURL(eventPosterObjectUrl);
    setEventPosterObjectUrl(null);
    setEventPosterOriginalUrl(null);
    setEventPosterFile(null);
    setEventPosterPreview(null);
    setEventPosterDragOver(false);
  };

  // Buka popup kalender native saat tombol kalender ditekan. Browser modern
  // mendukung showPicker(); fallback focus tetap membantu browser yang belum
  // mengimplementasikan API tersebut.
  const openEventDatePicker = () => {
    const input = eventDateInputRef.current;
    if (!input) return;

    input.focus();
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {
        // showPicker dapat menolak jika dipanggil di luar user gesture.
      }
    }
  };

  // Tanggal dipilih dari kalender → otomatis isi badge (angka hari + bulan) & teks tampil
  const handleEventDateChange = (iso: string) => {
    setEventDateIso(iso);
    if (!iso) {
      setEventDate("");
      setEventDayBadge("");
      setEventMonthBadge("");
      return;
    }
    const d = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(d.getTime())) {
      setEventDate("");
      setEventDayBadge("");
      setEventMonthBadge("");
      return;
    }
    setEventDate(formatIsoToDisplay(iso));
    setEventDayBadge(String(d.getDate()));
    setEventMonthBadge(
      d.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    );
  };

  // ── Poster upload (drag & drop / klik) ────────────────────────────
  const validatePosterFile = (file: File): string | null => {
    // Sama dengan daftar MIME di server (ALLOWED_IMAGE_MIME_TYPES) — drag & drop
    // melewati atribut accept, jadi validasi di sini harus tegas.
    if (!ALLOWED_POSTER_TYPES.includes(file.type)) {
      return "Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.";
    }
    if (file.size > MAX_POSTER_MB * 1024 * 1024) {
      return `Ukuran poster maksimal ${MAX_POSTER_MB}MB.`;
    }
    return null;
  };

  const handlePosterFile = (file: File) => {
    const err = validatePosterFile(file);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    // Revoke blob URL lama (kalau ada) agar tidak bocor memori
    if (eventPosterObjectUrl) URL.revokeObjectURL(eventPosterObjectUrl);
    const url = URL.createObjectURL(file);
    setEventPosterObjectUrl(url);
    setEventPosterFile(file);
    setEventPosterPreview(url);
  };

  const handlePosterDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setEventPosterDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handlePosterFile(file);
  };

  const handlePosterFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePosterFile(file);
  };

  const removePosterFile = () => {
    // Revoke blob baru & kembalikan preview ke poster lama (mode edit) agar
    // UI tidak tampak kosong padahal server masih menyimpan poster lama.
    if (eventPosterObjectUrl) {
      URL.revokeObjectURL(eventPosterObjectUrl);
      setEventPosterObjectUrl(null);
    }
    setEventPosterFile(null);
    setEventPosterPreview(eventPosterOriginalUrl);
  };

  const handleAddKegiatan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    // Tanggal wajib diisi. `eventDate` (bukan eventDateIso) agar data legacy
    // yang formatnya tak ter-parse tetap bisa disimpan tanpa mengubah tanggalnya.
    if (!eventDate) {
      setError("Silakan pilih Hari & Tanggal kegiatan terlebih dahulu.");
      return;
    }

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

  // ── Media Space handlers ──────────────────────────────────────────
  async function fetchMediaSpace() {
    try {
      const res = await fetch("/api/admin/media-space");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data.items)
          ? data.items
          : Array.isArray(data.data)
            ? data.data
            : [];
        setMediaList(list);
        setIsOrderChanged(false);
      }
    } catch {}
  }

  const startEditMedia = (item: any) => {
    setEditingMediaId(item.id);
    setMediaTitle(item.title || "");
    setMediaDescription(item.description || "");
    setMediaInstagramUrl(item.instagramUrl || "");
    if (mediaImageObjectUrl) URL.revokeObjectURL(mediaImageObjectUrl);
    setMediaImageObjectUrl(null);
    setMediaImageFile(null);
    setMediaImageOriginalUrl(item.imageUrl || null);
    setMediaImagePreview(item.imageUrl || null);
    setMediaImageDragOver(false);
    const input = document.getElementById("mediaImageInput") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const cancelEditMedia = () => {
    setEditingMediaId(null);
    setMediaTitle("");
    setMediaDescription("");
    setMediaInstagramUrl("");
    if (mediaImageObjectUrl) URL.revokeObjectURL(mediaImageObjectUrl);
    setMediaImageObjectUrl(null);
    setMediaImageOriginalUrl(null);
    setMediaImageFile(null);
    setMediaImagePreview(null);
    setMediaImageDragOver(false);
    const input = document.getElementById("mediaImageInput") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const validateMediaImage = (file: File): string | null => {
    if (!ALLOWED_POSTER_TYPES.includes(file.type)) {
      return "Format gambar tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.";
    }
    if (file.size > MAX_POSTER_MB * 1024 * 1024) {
      return `Ukuran gambar maksimal ${MAX_POSTER_MB}MB.`;
    }
    return null;
  };

  const handleMediaImageFile = (file: File) => {
    const err = validateMediaImage(file);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    if (mediaImageObjectUrl) URL.revokeObjectURL(mediaImageObjectUrl);
    const url = URL.createObjectURL(file);
    setMediaImageObjectUrl(url);
    setMediaImageFile(file);
    setMediaImagePreview(url);
  };

  const handleMediaImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setMediaImageDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleMediaImageFile(file);
  };

  const handleMediaImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleMediaImageFile(file);
  };

  const removeMediaImage = () => {
    const input = document.getElementById("mediaImageInput") as HTMLInputElement | null;
    if (input) input.value = "";
    if (mediaImageObjectUrl) {
      URL.revokeObjectURL(mediaImageObjectUrl);
      setMediaImageObjectUrl(null);
    }
    setMediaImageFile(null);
    setMediaImagePreview(mediaImageOriginalUrl);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!mediaTitle.trim()) {
      setError("Judul konten Media Space wajib diisi.");
      return;
    }

    if (!editingMediaId && !mediaImageFile) {
      setError("Foto postingan wajib diunggah untuk konten baru.");
      return;
    }

    setMediaSubmitting(true);

    try {
      const formData = new FormData();
      if (editingMediaId) {
        formData.append("id", editingMediaId);
      }
      formData.append("title", mediaTitle.trim());
      formData.append("description", mediaDescription.trim());
      formData.append("instagramUrl", mediaInstagramUrl.trim());
      if (mediaImageFile) {
        formData.append("image", mediaImageFile);
      }

      const res = await fetch("/api/admin/media-space", {
        method: editingMediaId ? "PUT" : "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan konten Media Space.");
      }

      setSuccessMsg(data.message || (editingMediaId ? "Konten Media Space berhasil diperbarui!" : "Konten Media Space berhasil ditambahkan!"));
      cancelEditMedia();
      fetchMediaSpace();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setMediaSubmitting(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus konten Media Space ini?")) return;
    setError("");
    setSuccessMsg("");
    setActionLoadingId(mediaId);

    try {
      const res = await fetch(`/api/admin/media-space?id=${mediaId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menghapus konten Media Space.");
      }

      setSuccessMsg(data.message || "Konten Media Space berhasil dihapus.");
      setMediaList((prev) => prev.filter((item) => item.id !== mediaId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaveOrder = async () => {
    setError("");
    setSuccessMsg("");
    setOrderSaving(true);
    try {
      const itemIds = mediaList.map((item) => item.id);
      const res = await fetch("/api/admin/media-space", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemIds }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan urutan Media Space.");
      }

      setSuccessMsg("Urutan 6 konten Media Space berhasil disimpan ke beranda!");
      const list = Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.data)
          ? data.data
          : [];
      if (list.length > 0) {
        setMediaList(list);
      }
      setIsOrderChanged(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setOrderSaving(false);
    }
  };

  const handleCancelOrder = () => {
    fetchMediaSpace();
    setIsOrderChanged(false);
  };

  const handleMoveMediaSlot = (mediaId: string, targetSlotIndex: number) => {
    const currentIndex = mediaList.findIndex((item) => item.id === mediaId);
    if (currentIndex === -1 || currentIndex === targetSlotIndex) return;

    const listCopy = [...mediaList];
    const [movedItem] = listCopy.splice(currentIndex, 1);
    listCopy.splice(targetSlotIndex, 0, movedItem);

    setMediaList(listCopy);
    setIsOrderChanged(true);
  };

  const handleMoveMediaStep = (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= mediaList.length) return;

    const listCopy = [...mediaList];
    const temp = listCopy[currentIndex];
    listCopy[currentIndex] = listCopy[targetIndex];
    listCopy[targetIndex] = temp;

    setMediaList(listCopy);
    setIsOrderChanged(true);
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
        <div className="flex flex-wrap gap-x-2 gap-y-1 border-b border-gray-200 dark:border-gray-800 mb-8">
          <button
            onClick={() => setActiveTab("moderasi")}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "moderasi"
                ? "border-lime text-forest-900 dark:text-lime dark:border-lime"
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
                ? "border-lime text-forest-900 dark:text-lime dark:border-lime"
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
                ? "border-lime text-forest-900 dark:text-lime dark:border-lime"
                : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Event Terdekat ({kegiatanList.length})
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "media"
                ? "border-lime text-forest-900 dark:text-lime dark:border-lime"
                : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <GalleryVertical className="w-4 h-4" />
            Media Space ({mediaList.length})
          </button>
          <button
            onClick={() => setActiveTab("kalender")}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "kalender"
                ? "border-lime text-forest-900 dark:text-lime dark:border-lime"
                : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Kalender UKMI
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "admins"
                ? "border-lime text-forest-900 dark:text-lime dark:border-lime"
                : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Kelola Admin
          </button>
          <button
            onClick={() => setActiveTab("titipan")}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "titipan"
                ? "border-lime text-forest-900 dark:text-lime dark:border-lime"
                : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            Titipan Semangat
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
                  className="bg-white dark:bg-gray-900 rounded-3xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors"
                >
                  {/* Card isi: thumbnail + info */}
                  <div className="flex flex-col sm:flex-row gap-5 p-5 md:p-6">
                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-48 md:w-56 h-40 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail bisa URL runtime Sanity/local */}
                      <img
                        src={resolveCoverUrl(draft.coverImage)}
                        alt={draft.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Category Badge & Date */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-2.5 py-0.5 bg-forest-50 border border-forest-150 dark:bg-forest-900/60 dark:border-forest-800 rounded text-[10px] font-bold text-forest-600 dark:text-lime uppercase tracking-wide">
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
                        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">
                          {draft.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed line-clamp-2">
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
                  </div>

                  {/* Action bar — TERPISAH di luar card isi */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-950/40 px-5 md:px-6 py-3.5">
                    <TransitionLink
                      href={`/admin/artikel/${encodeURIComponent(draft._id)}/edit`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-forest-600 hover:bg-forest-800 text-white rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Artikel
                    </TransitionLink>

                    <button
                      disabled={actionLoadingId !== null}
                      onClick={() => handleApprove(draft._id)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Setujui
                    </button>

                    <button
                      disabled={actionLoadingId !== null}
                      onClick={() => handleReject(draft._id)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold transition-all border border-gray-200 dark:border-gray-700 hover:border-red-100 dark:hover:border-red-800 cursor-pointer active:scale-95"
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
          const ITEMS_PER_PAGE = 6;
          const totalPages = Math.ceil(publishedArticles.length / ITEMS_PER_PAGE) || 1;
          const currentPage = Math.min(publishedPage, totalPages);
          const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
          const currentArticles = publishedArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

          return (
            <div className="space-y-8">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 items-stretch">
                    {currentArticles.map((article) => (
                      <div key={article._id} className="flex flex-col gap-3">
                        {/* Card artikel (thumbnail + info) — tanpa tombol */}
                        <ArticleCard article={article} />

                        {/* Action bar — TERPISAH di luar card artikel */}
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-2.5 shadow-sm">
                          <TransitionLink
                            href={`/admin/artikel/${encodeURIComponent(article._id)}/edit`}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-forest-600 hover:bg-forest-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </TransitionLink>
                          <button
                            type="button"
                            disabled={actionLoadingId !== null}
                            onClick={() => handleDeletePublished(article._id)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/60 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl text-xs font-bold transition-all border border-gray-200 dark:border-gray-700 hover:border-red-100 dark:hover:border-red-800 cursor-pointer active:scale-95 disabled:opacity-50"
                            aria-label={`Hapus artikel ${article.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls — 1 baris: prev | nomor (compact) | next */}
                  {totalPages > 1 && (
                    <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, publishedArticles.length)} dari {publishedArticles.length} artikel terbit
                      </p>

                      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                        {/* Prev — outline dulu, fill slide dari kiri saat hover */}
                        <button
                          type="button"
                          onClick={() => setPublishedPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          aria-disabled={currentPage === 1}
                          className={`${
                            currentPage === 1
                              ? "inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-full text-xs font-bold border-2 border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 opacity-50 cursor-not-allowed"
                              : "group/prev relative isolate inline-flex items-center gap-1 overflow-hidden rounded-full border-2 border-forest-600 dark:border-lime bg-transparent px-3 sm:px-4 py-2 text-xs font-bold text-forest-700 dark:text-lime transition-all duration-300 cursor-pointer active:scale-95 motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:shadow-forest-600/20 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50"
                          }`}
                        >
                          {currentPage !== 1 && (
                            <span
                              aria-hidden
                              className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-forest-600 dark:bg-lime motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-0 group-hover/prev:translate-x-0"
                            />
                          )}
                          <span
                            className={`relative z-10 inline-flex items-center gap-1 transition-colors duration-300 motion-reduce:transition-none ${
                              currentPage !== 1
                                ? "group-hover/prev:text-white dark:group-hover/prev:text-forest-950"
                                : ""
                            }`}
                          >
                            <ChevronLeft className="w-4 h-4 transition-transform duration-300 motion-safe:group-hover/prev:-translate-x-1 motion-reduce:transform-none" />
                            <span className="hidden sm:inline">Sebelumnya</span>
                          </span>
                        </button>

                        {/* Nomor halaman — compact (max 7, sisanya ellipsis), aktif hijau penuh */}
                        <div className="flex items-center gap-1.5">
                          {getPageItems(totalPages, currentPage).map((item, i) => {
                            if (item === "ellipsis") {
                              return (
                                <span
                                  key={`ellipsis-${i}`}
                                  aria-hidden
                                  className="w-6 sm:w-8 flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-500 select-none"
                                >
                                  …
                                </span>
                              );
                            }
                            const isActive = item === currentPage;
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => setPublishedPage(item)}
                                aria-current={isActive ? "page" : undefined}
                                className={`relative isolate w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50 ${
                                  isActive
                                    ? "bg-forest-600 dark:bg-lime text-white dark:text-forest-950 border-2 border-forest-600 dark:border-lime shadow-md shadow-forest-600/25 scale-110"
                                    : "border-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-600 dark:text-gray-300 hover:border-forest-600 dark:hover:border-lime hover:text-forest-700 dark:hover:text-lime hover:bg-forest-50 dark:hover:bg-forest-900/20 hover:shadow-sm motion-safe:hover:-translate-y-0.5 active:scale-95"
                                }`}
                              >
                                {item}
                              </button>
                            );
                          })}
                        </div>

                        {/* Next */}
                        <button
                          type="button"
                          onClick={() => setPublishedPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          aria-disabled={currentPage === totalPages}
                          className={`${
                            currentPage === totalPages
                              ? "inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-full text-xs font-bold border-2 border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 opacity-50 cursor-not-allowed"
                              : "group/next relative isolate inline-flex items-center gap-1 overflow-hidden rounded-full border-2 border-forest-600 dark:border-lime bg-transparent px-3 sm:px-4 py-2 text-xs font-bold text-forest-700 dark:text-lime transition-all duration-300 cursor-pointer active:scale-95 motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:shadow-forest-600/20 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50"
                          }`}
                        >
                          {currentPage !== totalPages && (
                            <span
                              aria-hidden
                              className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-forest-600 dark:bg-lime motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-0 group-hover/next:translate-x-0"
                            />
                          )}
                          <span
                            className={`relative z-10 inline-flex items-center gap-1 transition-colors duration-300 motion-reduce:transition-none ${
                              currentPage !== totalPages
                                ? "group-hover/next:text-white dark:group-hover/next:text-forest-950"
                                : ""
                            }`}
                          >
                            <span className="hidden sm:inline">Selanjutnya</span>
                            <ChevronRight className="w-4 h-4 transition-transform duration-300 motion-safe:group-hover/next:translate-x-1 motion-reduce:transform-none" />
                          </span>
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
                  {/* Judul & Hari/Tanggal Kegiatan */}
                  <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.7fr)_minmax(220px,0.8fr)] gap-5 md:col-span-2">
                    {/* Judul Kegiatan — area lebih lebar */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="event-title" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Judul Kegiatan <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="event-title"
                        type="text"
                        required
                        placeholder="mis. Kuliah Kerja Dakwah (KKD)"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none transition-all font-semibold dark:bg-gray-950 dark:text-white"
                      />
                    </div>

                    {/* Hari & Tanggal Kegiatan — area lebih kecil */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="event-date" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Hari & Tanggal <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          ref={eventDateInputRef}
                          id="event-date"
                          type="date"
                          value={eventDateIso}
                          onChange={(e) => handleEventDateChange(e.target.value)}
                          aria-describedby="event-date-help"
                          className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-600/15 transition-all font-medium dark:bg-gray-950 dark:text-white dark:[color-scheme:dark]"
                        />
                        <button
                          type="button"
                          onClick={openEventDatePicker}
                          aria-label="Buka kalender untuk memilih tanggal kegiatan"
                          title="Buka kalender"
                          className="absolute right-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-forest-600 hover:bg-forest-50 dark:text-lime dark:hover:bg-forest-950/60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                      <p id="event-date-help" className="text-[11px] text-gray-400 dark:text-gray-500">
                        Klik untuk membuka kalender sistem.
                      </p>
                    </div>
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

                {/* Poster Image File Upload — drag & drop / klik */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Upload Poster Event <span className="text-gray-400 dark:text-gray-500 normal-case">(Portrait 3:4 / 4:5)</span>
                  </label>
                  <div
                    role="button"
                    tabIndex={0}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setEventPosterDragOver(true);
                    }}
                    onDragLeave={(e) => {
                      // Hindari flicker saat kursor melewati elemen anak (preview, tombol)
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setEventPosterDragOver(false);
                      }
                    }}
                    onDrop={handlePosterDrop}
                    onClick={() => document.getElementById("eventPosterInput")?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        document.getElementById("eventPosterInput")?.click();
                      }
                    }}
                    className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all group outline-none ${
                      eventPosterDragOver
                        ? "border-lime bg-lime/10 dark:border-lime dark:bg-forest-950/40"
                        : eventPosterPreview
                          ? "border-lime bg-lime/10 dark:border-lime dark:bg-forest-950/30"
                          : "border-gray-300 hover:border-forest-600 dark:border-gray-700 dark:hover:border-lime focus-visible:ring-2 focus-visible:ring-forest-600/40"
                    }`}
                  >
                    <input
                      id="eventPosterInput"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handlePosterFileInput}
                      className="hidden"
                    />

                    {eventPosterPreview ? (
                      <div className="flex items-center justify-center gap-5 flex-wrap">
                        <div className="relative w-28 aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 shadow-md shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element -- blob preview is not supported by next/image */}
                          <img src={eventPosterPreview} alt="Preview Poster" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left space-y-2 min-w-0">
                          <p className="text-xs font-bold text-forest-700 dark:text-lime">
                            {eventPosterFile ? "Poster baru dipilih" : "Poster saat ini"}
                          </p>
                          {eventPosterFile && (
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 max-w-[220px] break-all">
                              {eventPosterFile.name} ({(eventPosterFile.size / 1024 / 1024).toFixed(1)} MB)
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById("eventPosterInput")?.click();
                              }}
                              className="px-3.5 py-1.5 bg-forest-600 hover:bg-forest-800 text-white rounded-full text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                            >
                              Ganti
                            </button>
                            {eventPosterFile && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePosterFile();
                                }}
                                className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                              >
                                Hapus
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <div className="w-12 h-12 rounded-2xl bg-forest-50 dark:bg-gray-800 border border-forest-100 dark:border-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Upload className="w-6 h-6 text-forest-600 dark:text-lime" />
                        </div>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                          Klik untuk pilih atau{" "}
                          <span className="text-forest-600 dark:text-lime">seret & lepas</span> poster di sini
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                          JPG, PNG, WEBP · Maks {MAX_POSTER_MB}MB · Portrait 3:4 / 4:5
                        </p>
                      </div>
                    )}
                  </div>
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

        {/* Tab 4: Media Space Management */}
        {activeTab === "media" && (
          <div className="space-y-10">
            {/* Form Tambah Konten Media Space */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-800 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-lime flex items-center gap-2">
                  <GalleryVertical className="w-5 h-5 text-forest-600 dark:text-lime" />
                  {editingMediaId ? "Edit Konten Media Space" : "Tambah Konten Media Space"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                  Konten tampil sebagai grid bento di beranda — klik foto membuka postingan Instagram.
                </p>
              </div>

              <form onSubmit={handleAddMedia} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Judul */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Judul Konten <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="mis. Kajian Pekanan Rabu"
                      value={mediaTitle}
                      onChange={(e) => setMediaTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none transition-all font-semibold dark:bg-gray-950 dark:text-white"
                    />
                  </div>

                  {/* Link Instagram */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Link Postingan Instagram
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.instagram.com/p/..."
                      value={mediaInstagramUrl}
                      onChange={(e) => setMediaInstagramUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none transition-all font-medium dark:bg-gray-950 dark:text-white"
                    />
                  </div>
                </div>

                {/* Gambar — drag & drop / klik */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Foto Postingan <span className="text-gray-400 dark:text-gray-500 normal-case">(disarankan persegi / landscape)</span>
                  </label>
                  <div
                    role="button"
                    tabIndex={0}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setMediaImageDragOver(true);
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setMediaImageDragOver(false);
                      }
                    }}
                    onDrop={handleMediaImageDrop}
                    onClick={() => document.getElementById("mediaImageInput")?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        document.getElementById("mediaImageInput")?.click();
                      }
                    }}
                    className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all group outline-none ${
                      mediaImageDragOver
                        ? "border-lime bg-lime/10 dark:border-lime dark:bg-forest-950/40"
                        : mediaImagePreview
                          ? "border-lime bg-lime/10 dark:border-lime dark:bg-forest-950/30"
                          : "border-gray-300 hover:border-forest-600 dark:border-gray-700 dark:hover:border-lime focus-visible:ring-2 focus-visible:ring-forest-600/40"
                    }`}
                  >
                    <input
                      id="mediaImageInput"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleMediaImageInput}
                      className="hidden"
                    />

                    {mediaImagePreview ? (
                      <div className="flex items-center justify-center gap-5 flex-wrap">
                        <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200 shadow-md shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element -- blob preview is not supported by next/image */}
                          <img src={mediaImagePreview} alt="Preview Konten Media Space" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left space-y-2 min-w-0">
                          <p className="text-xs font-bold text-forest-700 dark:text-lime">
                            {mediaImageFile ? "Foto baru dipilih" : "Foto saat ini"}
                          </p>
                          {mediaImageFile && (
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 max-w-[220px] break-all">
                              {mediaImageFile.name} ({(mediaImageFile.size / 1024 / 1024).toFixed(1)} MB)
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById("mediaImageInput")?.click();
                              }}
                              className="px-3.5 py-1.5 bg-forest-600 hover:bg-forest-800 text-white rounded-full text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                            >
                              Ganti
                            </button>
                            {mediaImageFile && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeMediaImage();
                                }}
                                className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                              >
                                Hapus
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <div className="w-12 h-12 rounded-2xl bg-forest-50 dark:bg-gray-800 border border-forest-100 dark:border-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <ImagePlus className="w-6 h-6 text-forest-600 dark:text-lime" />
                        </div>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                          Klik untuk pilih atau{" "}
                          <span className="text-forest-600 dark:text-lime">seret & lepas</span> foto di sini
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                          JPG, PNG, WEBP · Maks {MAX_POSTER_MB}MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Deskripsi singkat yang tampil saat hover di grid bento..."
                    value={mediaDescription}
                    onChange={(e) => setMediaDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none transition-all font-normal leading-relaxed dark:bg-gray-950 dark:text-white"
                  />
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="pt-2 flex justify-end gap-3">
                  {editingMediaId && (
                    <button
                      type="button"
                      onClick={cancelEditMedia}
                      className="px-5 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold transition-all cursor-pointer"
                    >
                      Batal Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={mediaSubmitting}
                    className="px-6 py-3 bg-forest-600 hover:bg-forest-800 dark:bg-lime dark:hover:bg-lime/90 dark:text-forest-950 text-white rounded-full text-xs font-bold transition-all inline-flex items-center gap-2 shadow-md cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {mediaSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {editingMediaId ? "Memperbarui Konten..." : "Menyimpan Konten..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingMediaId ? "Simpan Perubahan" : "Tambah Konten"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* List Konten Media Space & Reorder Management */}
            <div className="space-y-6">
              <div className={`p-4.5 sm:p-6 rounded-3xl border transition-all ${
                isOrderChanged
                  ? "bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 shadow-md"
                  : "bg-forest-50/60 dark:bg-forest-950/40 border-forest-100 dark:border-forest-900/60 shadow-xs"
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Sparkles className="w-5 h-5 text-forest-600 dark:text-lime" />
                      <h3 className="text-base font-bold text-forest-950 dark:text-lime">
                        Manajemen Posisi & Urutan Tampilan Beranda (#1 - #6)
                      </h3>
                      {isOrderChanged && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                          Ada Perubahan Belum Disimpan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      Atur posisi sesukamu dengan dropdown atau tombol panah. Posisi <strong>#1 (Besar Utama)</strong> dan <strong>#2 (Besar Sekunder)</strong> mengisi 2 sel kartu bento paling besar di beranda. Klik <strong>Simpan Urutan</strong> jika sudah sesuai.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isOrderChanged && (
                      <button
                        type="button"
                        onClick={handleCancelOrder}
                        disabled={orderSaving}
                        className="px-4 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                      >
                        Reset / Batal
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleSaveOrder}
                      disabled={orderSaving || !isOrderChanged}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all inline-flex items-center gap-2 shadow-md cursor-pointer active:scale-95 disabled:opacity-50 ${
                        isOrderChanged
                          ? "bg-forest-600 hover:bg-forest-800 dark:bg-lime dark:hover:bg-lime/90 dark:text-forest-950 text-white animate-pulse"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {orderSaving ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Menyimpan Urutan...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>{isOrderChanged ? "Simpan Urutan Beranda" : "Urutan Tersimpan"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {mediaList.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">Belum ada konten Media Space.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mediaList.map((item, idx) => {
                    const isSlot1 = idx === 0;
                    const isSlot2 = idx === 1;
                    const isDisplayedOnHome = idx < 6;

                    return (
                      <div
                        key={item.id}
                        className={`bg-white dark:bg-gray-900 rounded-2xl border p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                          isSlot1
                            ? "border-lime dark:border-lime ring-2 ring-forest-600/20 dark:ring-lime/20 bg-forest-50/30 dark:bg-forest-950/20"
                            : isSlot2
                              ? "border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20 dark:ring-emerald-400/20 bg-emerald-50/20 dark:bg-emerald-950/10"
                              : isDisplayedOnHome
                                ? "border-gray-200 dark:border-gray-800"
                                : "border-gray-200/60 dark:border-gray-800/60 opacity-80"
                        }`}
                      >
                        {/* Info & Thumbnail */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Badge Number */}
                          <div className="flex flex-col items-center justify-center shrink-0">
                            <span
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shadow-xs ${
                                isSlot1
                                  ? "bg-forest-600 text-white dark:bg-lime dark:text-forest-950"
                                  : isSlot2
                                    ? "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-gray-950"
                                    : isDisplayedOnHome
                                      ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                              }`}
                            >
                              #{idx + 1}
                            </span>
                          </div>

                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.imageUrl || "/placeholder.png"} alt={item.title} className="w-full h-full object-cover" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              {isSlot1 && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-forest-600 text-white dark:bg-lime dark:text-forest-950 uppercase tracking-wide">
                                  <Star className="w-3 h-3 fill-current" /> #1 Besar Utama
                                </span>
                              )}
                              {isSlot2 && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white dark:bg-emerald-400 dark:text-gray-950 uppercase tracking-wide">
                                  <Sparkles className="w-3 h-3" /> #2 Besar Sekunder
                                </span>
                              )}
                              {isDisplayedOnHome && !isSlot1 && !isSlot2 && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-50 text-forest-700 dark:bg-forest-950/60 dark:text-lime border border-forest-200 dark:border-forest-800 uppercase tracking-wide">
                                  Beranda (Standar)
                                </span>
                              )}
                              {!isDisplayedOnHome && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                                  Arsip (Tidak Tampil)
                                </span>
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description || "Tanpa deskripsi"}</p>
                          </div>
                        </div>

                        {/* Controls & Actions */}
                        <div className="flex items-center justify-between md:justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
                          {/* Slot Selector Dropdown */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 hidden lg:inline">Set Posisi:</span>
                            <select
                              value={idx < 6 ? idx : "other"}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val !== "other") {
                                  handleMoveMediaSlot(item.id, parseInt(val, 10));
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-xs font-bold text-gray-800 dark:text-gray-200 focus:border-forest-600 focus:outline-none cursor-pointer"
                            >
                              <option value={0}>🌟 Posisi #1 (Besar Utama)</option>
                              <option value={1}>⭐ Posisi #2 (Besar Sekunder)</option>
                              <option value={2}>📌 Posisi #3 (Kartu Standar)</option>
                              <option value={3}>📌 Posisi #4 (Kartu Standar)</option>
                              <option value={4}>📌 Posisi #5 (Kartu Standar)</option>
                              <option value={5}>📌 Posisi #6 (Kartu Standar)</option>
                              {idx >= 6 && <option value="other">📁 Arsip (#{idx + 1})</option>}
                            </select>
                          </div>

                          {/* Up & Down Reorder Buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveMediaStep(idx, "up")}
                              disabled={idx === 0}
                              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-forest-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              title="Pindahkan Ke Atas"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveMediaStep(idx, "down")}
                              disabled={idx === mediaList.length - 1}
                              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-forest-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              title="Pindahkan Ke Bawah"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Edit & Delete Buttons */}
                          <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-800 pl-2">
                            <button
                              onClick={() => startEditMedia(item)}
                              className="p-2 bg-forest-50 hover:bg-forest-100 text-forest-700 dark:bg-forest-950 dark:hover:bg-forest-900 dark:text-lime rounded-xl transition-colors cursor-pointer"
                              title="Edit Konten"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMedia(item.id)}
                              disabled={actionLoadingId === item.id}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                              title="Hapus Konten"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Kalender UKMI (Supabase) */}
        {activeTab === "kalender" && <KalenderAdminTab />}

        {/* Tab 6: Kelola Admin (Supabase + ENV) */}
        {activeTab === "admins" && <AdminsAdminTab />}

        {/* Tab 7: Titipan Semangat (Supabase + Local) */}
        {activeTab === "titipan" && <TitipanSemangatAdminTab />}

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
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-forest-50 border border-forest-150 dark:bg-forest-900/60 dark:border-forest-800 rounded-full text-[10px] font-bold text-forest-600 dark:text-lime mb-3 w-fit uppercase tracking-wide">
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
                  <div className="border-l-4 border-lime bg-forest-50/20 dark:bg-forest-950/30 px-4 py-3 rounded-r-xl italic text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium mb-6">
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
