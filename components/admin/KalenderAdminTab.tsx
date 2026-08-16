"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  CalendarDays,
  Tag,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import type { KalenderEventRow } from "@/lib/supabase";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatMonthYear(yearMonth: string): string {
  const parts = yearMonth.split("-");
  if (parts.length < 2) return yearMonth;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const monthName = MONTH_NAMES[monthIdx] || parts[1];
  return `${monthName} ${year}`;
}

function formatFullDateIndo(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function KalenderAdminTab() {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [events, setEvents] = useState<KalenderEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search & Filters (Month & Type)
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<"Agenda UKMI" | "Puasa Sunnah">("Agenda UKMI");
  const [bidang, setBidang] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/kalender");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal mengambil data kalender.");
      setEvents(json.data || []);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat agenda kalender.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    fetchEvents();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setType("Agenda UKMI");
    setBidang("");
    setDescription("");
  };

  const startEdit = (item: KalenderEventRow) => {
    setIsEditing(true);
    setEditingId(item.id);
    setTitle(item.title);
    setDate(item.date);
    setTime(item.time || "");
    setLocation(item.location || "");
    setType((item.type as "Agenda UKMI" | "Puasa Sunnah") || "Agenda UKMI");
    setBidang(item.bidang || "");
    setDescription(item.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !date.trim()) {
      setError("Judul dan tanggal agenda wajib diisi.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        date: date.trim(),
        time: time.trim() || undefined,
        location: location.trim() || undefined,
        type,
        bidang: bidang.trim() || undefined,
        description: description.trim() || undefined,
      };

      const res = await fetch("/api/admin/kalender", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { ...payload, id: editingId } : payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal menyimpan agenda.");

      setSuccess(isEditing ? "Agenda berhasil diperbarui." : "Agenda baru berhasil ditambahkan.");
      resetForm();
      fetchEvents();
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, eventTitle: string) => {
    if (!confirm(`Hapus agenda "${eventTitle}"?`)) return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/kalender", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal menghapus agenda.");

      setSuccess("Agenda berhasil dihapus.");
      fetchEvents();
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat menghapus.");
    } finally {
      setDeletingId(null);
    }
  };

  // Group events by YYYY-MM
  const { groupedEvents, availableMonths, totalFilteredCount } = useMemo(() => {
    const map = new Map<string, KalenderEventRow[]>();
    const monthsSet = new Set<string>();

    const q = search.trim().toLowerCase();
    const filtered = events.filter((ev) => {
      // 1. Filter by Type
      if (selectedType !== "ALL" && ev.type !== selectedType) {
        return false;
      }

      // 2. Filter by Search Query
      if (!q) return true;
      return (
        ev.title.toLowerCase().includes(q) ||
        (ev.location && ev.location.toLowerCase().includes(q)) ||
        (ev.bidang && ev.bidang.toLowerCase().includes(q)) ||
        (ev.date && ev.date.toLowerCase().includes(q)) ||
        (ev.type && ev.type.toLowerCase().includes(q))
      );
    });

    for (const ev of filtered) {
      const yearMonth = ev.date ? ev.date.substring(0, 7) : "Lainnya";
      monthsSet.add(yearMonth);

      if (!map.has(yearMonth)) {
        map.set(yearMonth, []);
      }
      map.get(yearMonth)!.push(ev);
    }

    // Sort months chronologically
    const sortedMonths = Array.from(monthsSet).sort();

    // Sort events inside each month
    for (const [, list] of map.entries()) {
      list.sort((a, b) => (a.date > b.date ? 1 : -1));
    }

    return {
      groupedEvents: map,
      availableMonths: sortedMonths,
      totalFilteredCount: filtered.length,
    };
  }, [events, search, selectedType]);

  const displayedMonths = useMemo(() => {
    if (selectedMonth === "ALL") return availableMonths;
    return availableMonths.filter((m) => m === selectedMonth);
  }, [availableMonths, selectedMonth]);

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-2xl flex items-center gap-2 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Tambah / Edit Agenda */}
      <div className="bg-white dark:bg-gray-900 border-2 border-forest-600/30 dark:border-lime/30 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-forest-900 dark:text-lime flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit2 className="w-6 h-6 text-forest-600 dark:text-lime" />
                <span>Edit Agenda Kalender</span>
              </>
            ) : (
              <>
                <Plus className="w-6 h-6 text-forest-600 dark:text-lime" />
                <span>Tambah Agenda Kalender Baru</span>
              </>
            )}
          </h2>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Batal Edit</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Judul Agenda / Nama Kegiatan *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Rapat Pleno Tengah 2026"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-forest-600/40 dark:focus:ring-lime/50 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Tanggal Kegiatan *
                </label>
                {date && (
                  <span className="text-[11px] font-bold text-forest-600 dark:text-lime">
                    {formatFullDateIndo(date)}
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <input
                  ref={dateInputRef}
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-forest-600/40 dark:focus:ring-lime/50 focus:outline-none dark:[color-scheme:dark]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = dateInputRef.current;
                    if (!input) return;
                    input.focus();
                    if (typeof input.showPicker === "function") {
                      try {
                        input.showPicker();
                      } catch {
                        // fallback focus
                      }
                    }
                  }}
                  title="Buka Kalender"
                  aria-label="Pilih Tanggal dari Kalender"
                  className="absolute right-1.5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-forest-600 hover:bg-forest-50 dark:text-lime dark:hover:bg-lime/10 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Tipe Agenda
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-forest-600/40 dark:focus:ring-lime/50 focus:outline-none cursor-pointer"
              >
                <option value="Agenda UKMI">Agenda UKMI</option>
                <option value="Puasa Sunnah">Puasa Sunnah</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Bidang Penanggung Jawab
              </label>
              <select
                value={bidang}
                onChange={(e) => setBidang(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-forest-600/40 dark:focus:ring-lime/50 focus:outline-none cursor-pointer"
              >
                <option value="">-- Pilih Bidang --</option>
                <option value="Ketum">Ketua Umum</option>
                <option value="Sekum">Sekretaris Umum</option>
                <option value="Bendum">Bendahara Umum</option>
                <option value="Syiar">Bidang Syiar</option>
                <option value="Internal">Bidang Internal</option>
                <option value="Eksternal">Bidang Eksternal</option>
                <option value="Media">Bidang Media</option>
                <option value="Kemus">Bidang Kemuslimahan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Waktu Pelaksanaan
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Contoh: 08:00 WIB / Fleksibel"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-forest-600/40 dark:focus:ring-lime/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Lokasi Tempat
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Masjid Nurul Huda UNS / Ruang Seminar"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-forest-600/40 dark:focus:ring-lime/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Keterangan singkat tentang kegiatan..."
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-forest-600/40 dark:focus:ring-lime/50 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-forest-600 dark:bg-lime text-white dark:text-forest-950 font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 text-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : isEditing ? (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Tambah ke Kalender</span>
                </>
              )}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm cursor-pointer"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Daftar Agenda Per Bulan */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-forest-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-forest-600 dark:text-lime" />
              <span>Daftar Agenda Kalender ({events.length})</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Agenda dikelompokkan berdasarkan bulan pelaksanaan.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari agenda / lokasi..."
                className="w-full pl-9 pr-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-forest-600/40 dark:focus:ring-lime/50 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdown Bulan */}
            <div className="relative w-full sm:w-auto">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full sm:w-auto pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-forest-600/40 dark:focus:ring-lime/50 focus:outline-none cursor-pointer font-medium"
              >
                <option value="ALL">Semua Bulan ({totalFilteredCount})</option>
                {availableMonths.map((m) => {
                  const count = groupedEvents.get(m)?.length || 0;
                  return (
                    <option key={m} value={m}>
                      {formatMonthYear(m)} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              onClick={fetchEvents}
              className="text-xs font-bold text-forest-600 dark:text-lime hover:underline cursor-pointer whitespace-nowrap ml-1"
            >
              Segarkan
            </button>
          </div>
        </div>

        {/* Filter Tipe Agenda */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-gray-100 dark:border-gray-800/80">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1">
            Tipe:
          </span>
          <button
            onClick={() => setSelectedType("ALL")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedType === "ALL"
                ? "bg-forest-600 dark:bg-lime text-white dark:text-forest-950 shadow-xs"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Semua Tipe
          </button>
          <button
            onClick={() => setSelectedType("Agenda UKMI")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedType === "Agenda UKMI"
                ? "bg-forest-600 dark:bg-lime text-white dark:text-forest-950 shadow-xs"
                : "bg-forest-50 dark:bg-forest-950/40 text-forest-800 dark:text-forest-300 hover:bg-forest-100 dark:hover:bg-forest-900/60"
            }`}
          >
            Agenda UKMI
          </button>
          <button
            onClick={() => setSelectedType("Puasa Sunnah")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedType === "Puasa Sunnah"
                ? "bg-amber-600 dark:bg-amber-400 text-white dark:text-amber-950 shadow-xs"
                : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60"
            }`}
          >
            Puasa Sunnah
          </button>
        </div>

        {/* Konten Daftar Grouped by Month */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600 dark:text-lime" />
            <span className="text-xs font-bold">Memuat agenda kalender...</span>
          </div>
        ) : displayedMonths.length === 0 ? (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
            {search
              ? "Tidak ada agenda yang cocok dengan kata kunci pencarian."
              : "Belum ada agenda kalender di database."}
          </div>
        ) : (
          <div className="space-y-6">
            {displayedMonths.map((yearMonth) => {
              const monthEvents = groupedEvents.get(yearMonth) || [];
              return (
                <div
                  key={yearMonth}
                  className="border border-gray-200/80 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs"
                >
                  {/* Month Header Banner */}
                  <div className="bg-forest-50/80 dark:bg-forest-950/50 px-4 sm:px-5 py-3 border-b border-gray-200/80 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-forest-600 dark:text-lime" />
                      <h4 className="font-bold text-sm sm:text-base text-forest-950 dark:text-lime">
                        {formatMonthYear(yearMonth)}
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold border border-gray-200/60 dark:border-gray-700">
                      {monthEvents.length} Agenda
                    </span>
                  </div>

                  {/* Table for this month */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-gray-50/50 dark:bg-gray-800/30 text-gray-400 uppercase text-[10px] sm:text-xs border-b border-gray-100 dark:border-gray-800">
                        <tr>
                          <th className="py-2.5 px-3 w-28">Tanggal</th>
                          <th className="py-2.5 px-3">Judul Agenda</th>
                          <th className="py-2.5 px-3 w-28">Tipe</th>
                          <th className="py-2.5 px-3 w-32">Bidang</th>
                          <th className="py-2.5 px-3">Waktu & Lokasi</th>
                          <th className="py-2.5 px-3 text-right w-24">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
                        {monthEvents.map((ev) => (
                          <tr
                            key={ev.id}
                            className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                          >
                            <td className="py-3 px-3 whitespace-nowrap font-bold text-gray-900 dark:text-white">
                              {ev.date}
                            </td>
                            <td className="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200">
                              <div>{ev.title}</div>
                              {ev.description && (
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 font-normal line-clamp-1">
                                  {ev.description}
                                </p>
                              )}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  ev.type === "Puasa Sunnah"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                    : "bg-forest-100 text-forest-800 dark:bg-lime/20 dark:text-lime"
                                }`}
                              >
                                {ev.type}
                              </span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              {ev.bidang ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-forest-50 dark:bg-lime/10 text-forest-800 dark:text-lime rounded-lg text-xs font-bold border border-forest-200/50 dark:border-lime/20">
                                  <Tag className="w-3 h-3 text-forest-600 dark:text-lime" />
                                  <span>{ev.bidang}</span>
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400">
                              {ev.time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                                  <span>{ev.time}</span>
                                </div>
                              )}
                              {ev.location && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                  <span className="truncate max-w-[200px]">{ev.location}</span>
                                </div>
                              )}
                              {!ev.time && !ev.location && <span className="text-gray-400">-</span>}
                            </td>
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => startEdit(ev)}
                                  className="p-1.5 text-forest-600 hover:bg-forest-50 dark:text-lime dark:hover:bg-lime/10 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Agenda"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(ev.id, ev.title)}
                                  disabled={deletingId === ev.id}
                                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                  title="Hapus Agenda"
                                >
                                  {deletingId === ev.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
