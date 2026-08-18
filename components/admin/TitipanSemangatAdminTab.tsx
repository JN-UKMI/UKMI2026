"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MessageSquareHeart,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  Copy,
  Check,
  X,
  Clock,
  User,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface TitipanItem {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

function formatDateIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function TitipanSemangatAdminTab() {
  const [messages, setMessages] = useState<TitipanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TitipanItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // Delete State
  const [deletingItem, setDeletingItem] = useState<TitipanItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/titipan-semangat");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal mengambil data pesan.");
      setMessages(json.data || []);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat pesan titipan semangat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormMessage("");
    setModalError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: TitipanItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormMessage(item.message);
    setModalError("");
    setIsModalOpen(true);
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) {
      setModalError("Nama dan isi pesan wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setModalError("");

    try {
      const isEdit = !!editingItem;
      const url = "/api/admin/titipan-semangat";
      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit
        ? { id: editingItem.id, name: formName.trim(), message: formMessage.trim() }
        : { name: formName.trim(), message: formMessage.trim() };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal menyimpan pesan.");

      setSuccess(
        isEdit
          ? "Pesan titipan semangat berhasil diperbarui!"
          : "Pesan titipan semangat baru berhasil ditambahkan!"
      );
      setTimeout(() => setSuccess(""), 4000);

      setIsModalOpen(false);
      fetchMessages();
    } catch (err: any) {
      setModalError(err?.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);

    try {
      const res = await fetch(
        `/api/admin/titipan-semangat?id=${encodeURIComponent(deletingItem.id)}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal menghapus pesan.");

      setSuccess("Pesan titipan semangat berhasil dihapus.");
      setTimeout(() => setSuccess(""), 4000);
      setDeletingItem(null);
      fetchMessages();
    } catch (err: any) {
      setError(err?.message || "Gagal menghapus pesan.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMessages = useMemo(() => {
    if (!search.trim()) return messages;
    const q = search.toLowerCase();
    return messages.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.message.toLowerCase().includes(q)
    );
  }, [messages, search]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border-2 border-forest-600/30 dark:border-lime/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-forest-50 dark:bg-lime/10 text-forest-700 dark:text-lime border border-forest-200 dark:border-lime/30">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-forest-950 dark:text-lime tracking-tight">
                Kelola Titipan Semangat
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Organisir, edit, dan hapus pesan inspirasi komunitas yang tampil pada kartu popup beranda.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchMessages}
            disabled={loading}
            title="Muat Ulang"
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-600 dark:bg-lime text-white dark:text-forest-950 rounded-xl font-bold text-xs sm:text-sm shadow-sm hover:shadow-md hover:opacity-95 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pesan</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau isi pesan..."
            className="w-full text-xs pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:border-forest-600 dark:focus:border-lime focus:outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs font-mono text-gray-500 dark:text-gray-400 self-start sm:self-center">
          Total: <span className="font-bold text-forest-700 dark:text-lime">{filteredMessages.length}</span> pesan
        </div>
      </div>

      {/* Messages Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-forest-600 dark:text-lime mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Memuat daftar pesan titipan semangat...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <MessageSquareHeart className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {search ? "Tidak ada pesan yang cocok dengan kata kunci pencarian." : "Belum ada pesan titipan semangat."}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Klik tombol &ldquo;Tambah Pesan&rdquo; di atas untuk menambahkan pesan baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMessages.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 hover:border-lime/60 dark:hover:border-lime/60 transition-all flex flex-col justify-between gap-3 shadow-xs group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-forest-100 dark:bg-forest-900/60 text-forest-700 dark:text-lime flex items-center justify-center font-bold text-xs shrink-0">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-forest-950 dark:text-white truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400 shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{formatDateIndo(item.created_at)}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-normal break-words">
                  &ldquo;{item.message}&rdquo;
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800/60 text-xs">
                <button
                  onClick={() => handleCopy(item.id, `"${item.message}" - ${item.name}`)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:text-forest-700 dark:hover:text-lime transition-colors cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-forest-700 dark:hover:text-lime hover:bg-forest-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    title="Edit Pesan"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingItem(item)}
                    className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="Hapus Pesan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 border-2 border-forest-600 dark:border-lime rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-forest-600 dark:text-lime" />
                <h3 className="font-bold text-base text-forest-950 dark:text-white">
                  {editingItem ? "Edit Pesan Titipan" : "Tambah Pesan Titipan"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nama Pengirim
                </label>
                <input
                  type="text"
                  maxLength={80}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Koala, Me, Ahmad..."
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:border-forest-600 dark:focus:border-lime focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Isi Pesan Semangat
                </label>
                <textarea
                  maxLength={300}
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Tuliskan kata-kata semangat atau doa baik..."
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:border-forest-600 dark:focus:border-lime focus:outline-none transition-colors resize-none"
                />
                <div className="text-right text-[10px] font-mono text-gray-400 mt-1">
                  {formMessage.length}/300
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formName.trim() || !formMessage.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-forest-600 dark:bg-lime text-white dark:text-forest-950 rounded-xl font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>{editingItem ? "Simpan Perubahan" : "Tambahkan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Deletion Confirmation */}
      {deletingItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 border-2 border-red-500 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              <h3 className="font-bold text-base">Hapus Pesan?</h3>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus pesan dari{" "}
              <strong className="font-bold text-forest-900 dark:text-white">
                {deletingItem.name}
              </strong>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs italic text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700/60">
              &ldquo;{deletingItem.message}&rdquo;
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Hapus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
