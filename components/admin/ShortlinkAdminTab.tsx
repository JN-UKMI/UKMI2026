"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Link2,
  Plus,
  Search,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  Trash2,
  RefreshCw,
  MousePointerClick,
  Sparkles,
  AlertCircle,
  X,
  Loader2,
  Dices,
} from "lucide-react";
import type { ShortlinkRow } from "@/lib/supabase";

function generateRandomSlug(length = 6): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function ShortlinkAdminTab() {
  const [links, setLinks] = useState<ShortlinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Create / Edit State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShortlinkRow | null>(null);
  const [targetUrl, setTargetUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, startSubmit] = useTransition();

  // Delete Confirm Modal State
  const [deleteModalItem, setDeleteModalItem] = useState<ShortlinkRow | null>(null);
  const [isDeleting, startDelete] = useTransition();

  // Copy state per ID
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch data
  const fetchShortlinks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/shortlinks");
      const json = await res.json();
      if (res.ok && json.ok && json.data) {
        setLinks(json.data.links || []);
      } else {
        setError(json.error?.message || "Gagal memuat data shortlink.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlinks();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setTargetUrl("");
    setSlug(generateRandomSlug());
    setTitle("");
    setFormError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ShortlinkRow) => {
    setEditingItem(item);
    setTargetUrl(item.target_url);
    setSlug(item.slug);
    setTitle(item.title || "");
    setFormError("");
    setModalOpen(true);
  };

  const handleRandomizeSlug = () => {
    setSlug(generateRandomSlug());
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    let cleanedTarget = targetUrl.trim();
    if (!cleanedTarget) {
      setFormError("Target URL wajib diisi.");
      return;
    }

    if (!cleanedTarget.startsWith("http://") && !cleanedTarget.startsWith("https://")) {
      cleanedTarget = "https://" + cleanedTarget;
    }

    const cleanSlug = slug.trim().toLowerCase();
    if (!cleanSlug) {
      setFormError("Hasil slug wajib diisi.");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(cleanSlug)) {
      setFormError("Slug hanya boleh berisi huruf, angka, strip (-), dan garis bawah (_).");
      return;
    }

    startSubmit(async () => {
      try {
        const isEdit = !!editingItem;
        const endpoint = "/api/admin/shortlinks";
        const method = isEdit ? "PUT" : "POST";
        const payload = isEdit
          ? { id: editingItem.id, slug: cleanSlug, target_url: cleanedTarget, title: title.trim() }
          : { slug: cleanSlug, target_url: cleanedTarget, title: title.trim() };

        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (res.ok && json.ok) {
          setSuccessMsg(isEdit ? "Shortlink berhasil diperbarui." : "Shortlink berhasil dibuat.");
          setModalOpen(false);
          fetchShortlinks();
        } else {
          setFormError(json.error?.message || "Gagal menyimpan shortlink.");
        }
      } catch {
        setFormError("Terjadi kesalahan jaringan saat menyimpan.");
      }
    });
  };

  const handleDelete = () => {
    if (!deleteModalItem) return;
    startDelete(async () => {
      try {
        const res = await fetch("/api/admin/shortlinks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: deleteModalItem.id }),
        });
        const json = await res.json();
        if (res.ok && json.ok) {
          setSuccessMsg(`Shortlink /s/${deleteModalItem.slug} berhasil dihapus.`);
          setDeleteModalItem(null);
          fetchShortlinks();
        } else {
          setError(json.error?.message || "Gagal menghapus shortlink.");
        }
      } catch {
        setError("Terjadi kesalahan jaringan saat menghapus.");
      }
    });
  };

  const handleCopyLink = async (item: ShortlinkRow) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://jnukmi.com";
    const fullUrl = `${origin}/${item.slug}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Fallback
    }
  };

  // Filtered links
  const filteredLinks = links.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.slug.toLowerCase().includes(q) ||
      l.target_url.toLowerCase().includes(q) ||
      (l.title && l.title.toLowerCase().includes(q))
    );
  });

  const totalClicks = links.reduce((sum, item) => sum + (item.clicks || 0), 0);

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-green-50 dark:bg-green-950/40 border-l-4 border-green-500 text-green-700 dark:text-green-300 text-xs font-bold rounded-r-xl flex items-center justify-between">
          <span>✅ {successMsg}</span>
          <button
            onClick={() => setSuccessMsg("")}
            className="text-green-700 dark:text-green-300 hover:opacity-75 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border-l-4 border-red-500 text-red-700 dark:text-red-300 text-xs font-bold rounded-r-xl flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-700 dark:text-red-300 hover:opacity-75 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Card & Stats */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-forest-900 dark:text-lime font-black text-xl">
            <Link2 className="w-6 h-6 text-forest-600 dark:text-lime" />
            <h2>Shortlink Generator</h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Buat dan kelola tautan pendek kustom langsung (<code className="font-mono text-forest-700 dark:text-lime">jnukmi.com/[slug]</code>) untuk formulir, media sosial, dan kegiatan.
          </p>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="bg-forest-50 dark:bg-gray-800/80 px-4 py-2.5 rounded-2xl border border-forest-100 dark:border-gray-700 flex items-center gap-3">
            <div className="text-center">
              <span className="block text-[10px] uppercase font-bold text-gray-400">Total Link</span>
              <span className="text-base font-black text-forest-900 dark:text-lime">{links.length}</span>
            </div>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="text-center">
              <span className="block text-[10px] uppercase font-bold text-gray-400">Total Klik</span>
              <span className="text-base font-black text-forest-900 dark:text-lime">{totalClicks}</span>
            </div>
          </div>

          <button
            onClick={fetchShortlinks}
            disabled={loading}
            className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-lime" : ""}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-3 bg-forest-600 hover:bg-forest-700 dark:bg-lime dark:hover:bg-lime/90 text-white dark:text-forest-950 font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Shortlink</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan slug, target URL, atau keterangan..."
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-lime dark:focus:border-lime transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content Table / Cards */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-lime" />
            <span className="text-xs">Memuat daftar shortlink...</span>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Link2 className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-700" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              {searchQuery ? "Tidak ada shortlink yang sesuai pencarian." : "Belum ada shortlink yang dibuat."}
            </p>
            <p className="text-xs text-gray-400">
              Klik tombol &ldquo;Buat Shortlink&rdquo; di atas untuk membuat tautan pendek pertama.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredLinks.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-forest-50/30 dark:hover:bg-gray-800/30 transition-colors"
                >
                  {/* Left: Info */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-3 py-1 bg-forest-50 dark:bg-lime/10 text-forest-900 dark:text-lime font-mono font-bold text-xs sm:text-sm rounded-xl border border-forest-200 dark:border-lime/30 inline-flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
                        /{item.slug}
                      </span>
                      {item.title && (
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                          {item.title}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[11px] font-mono">
                        <MousePointerClick className="w-3 h-3 text-forest-600 dark:text-lime" />
                        {item.clicks || 0} klik
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-semibold text-gray-400">Target:</span>
                      <a
                        href={item.target_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-forest-700 dark:text-lime hover:underline font-mono text-[11px] sm:text-xs max-w-md inline-flex items-center gap-1"
                      >
                        {item.target_url}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleCopyLink(item)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isCopied
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-lime dark:hover:border-lime"
                      }`}
                      title="Salin Shortlink"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl transition-all cursor-pointer"
                      title="Buka / Uji Shortlink"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-forest-50 hover:text-forest-700 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl transition-all cursor-pointer"
                      title="Edit Shortlink"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteModalItem(item)}
                      className="p-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded-xl transition-all cursor-pointer"
                      title="Hapus Shortlink"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create / Edit Shortlink */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col transition-colors">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-forest-50 dark:bg-lime/10 text-forest-700 dark:text-lime">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-forest-900 dark:text-white">
                    {editingItem ? "Edit Shortlink" : "Buat Shortlink Baru"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Masukkan URL tujuan dan tentukan slug hasil link pendek.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 rounded-2xl text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Target URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Target URL (Tujuan Asli) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://forms.gle/xyz123 atau https://..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs sm:text-sm font-mono focus:outline-none focus:border-lime dark:focus:border-lime"
                />
              </div>

              {/* Hasil Slug Shortlink */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                    Hasil Slug Pendek <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRandomizeSlug}
                    className="text-[11px] font-bold text-forest-700 dark:text-lime hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    Acak Slug
                  </button>
                </div>
                <div className="flex items-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden focus-within:border-lime dark:focus-within:border-lime">
                  <span className="px-3.5 py-2.5 text-xs text-gray-400 font-mono select-none bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
                    jnukmi.com/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    placeholder="nama-link-kamu"
                    className="w-full px-3 py-2.5 bg-transparent text-xs sm:text-sm font-mono focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  Hanya huruf kecil, angka, tanda strip (-), dan garis bawah (_).
                </p>
              </div>

              {/* Title / Keterangan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Judul / Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Pendaftaran Diklat 2026, Formulir Evaluasi..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-lime dark:focus:border-lime"
                />
              </div>

              {/* Live Preview Card */}
              {slug && targetUrl && (
                <div className="p-3.5 rounded-2xl bg-forest-50/60 dark:bg-gray-800/60 border border-forest-100 dark:border-gray-700/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-forest-700 dark:text-lime block">
                    Preview Redirect
                  </span>
                  <div className="font-mono text-xs text-forest-900 dark:text-white truncate">
                    jnukmi.com/{slug || "..."}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                    <span>➔ {targetUrl}</span>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-forest-600 hover:bg-forest-700 dark:bg-lime dark:hover:bg-lime/90 text-white dark:text-forest-950 shadow-sm flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{editingItem ? "Perbarui Shortlink" : "Buat Shortlink"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteModalItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-2.5 rounded-2xl bg-red-100 dark:bg-red-950/60">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-forest-900 dark:text-white">
                Hapus Shortlink?
              </h3>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Apakah kamu yakin ingin menghapus shortlink <strong className="font-mono text-forest-900 dark:text-lime">/s/{deleteModalItem.slug}</strong>? Tautan ini tidak akan dapat diakses lagi oleh publik.
            </p>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-xs font-mono truncate text-gray-500">
              Target: {deleteModalItem.target_url}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
