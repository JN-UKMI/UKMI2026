"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  ShieldCheck,
  LogIn,
  LogOut,
  FileText,
  Trash2,
  Edit,
  Calendar,
  Image,
  Users,
  MessageSquareHeart,
  Link2,
  Loader2,
  RefreshCw,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  KeyRound,
  UserPlus,
  Clock,
} from "lucide-react";

interface ActivityLogItem {
  id: string;
  admin_email: string;
  admin_name: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  target_name: string | null;
  details: string | null;
  created_at: string;
}

const ACTION_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  login: {
    label: "Login",
    icon: <LogIn className="w-3.5 h-3.5" />,
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  logout: {
    label: "Logout",
    icon: <LogOut className="w-3.5 h-3.5" />,
    color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  },
  approve_article: {
    label: "Setujui Artikel",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  reject_article: {
    label: "Tolak Artikel",
    icon: <XCircle className="w-3.5 h-3.5" />,
    color: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  update_article: {
    label: "Edit Artikel",
    icon: <Edit className="w-3.5 h-3.5" />,
    color: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  delete_article: {
    label: "Hapus Artikel",
    icon: <Trash2 className="w-3.5 h-3.5" />,
    color: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  create_kegiatan: {
    label: "Tambah Event",
    icon: <Calendar className="w-3.5 h-3.5" />,
    color: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  },
  update_kegiatan: {
    label: "Edit Event",
    icon: <Calendar className="w-3.5 h-3.5" />,
    color: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  },
  delete_kegiatan: {
    label: "Hapus Event",
    icon: <Trash2 className="w-3.5 h-3.5" />,
    color: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  create_media_space: {
    label: "Tambah Media",
    icon: <Image className="w-3.5 h-3.5" />,
    color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
  },
  update_media_space: {
    label: "Edit Media",
    icon: <Image className="w-3.5 h-3.5" />,
    color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
  },
  delete_media_space: {
    label: "Hapus Media",
    icon: <Trash2 className="w-3.5 h-3.5" />,
    color: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  reorder_media_space: {
    label: "Urutkan Media",
    icon: <ArrowUpDown className="w-3.5 h-3.5" />,
    color: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  create_kalender: {
    label: "Tambah Kalender",
    icon: <Calendar className="w-3.5 h-3.5" />,
    color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  },
  update_kalender: {
    label: "Edit Kalender",
    icon: <Calendar className="w-3.5 h-3.5" />,
    color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  },
  delete_kalender: {
    label: "Hapus Kalender",
    icon: <Trash2 className="w-3.5 h-3.5" />,
    color: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  add_admin: {
    label: "Tambah Admin",
    icon: <UserPlus className="w-3.5 h-3.5" />,
    color: "bg-forest-50 text-forest-700 dark:bg-lime/10 dark:text-lime border-forest-200 dark:border-lime/30",
  },
  update_admin: {
    label: "Edit Admin",
    icon: <KeyRound className="w-3.5 h-3.5" />,
    color: "bg-forest-50 text-forest-700 dark:bg-lime/10 dark:text-lime border-forest-200 dark:border-lime/30",
  },
  delete_admin: {
    label: "Hapus Admin",
    icon: <Trash2 className="w-3.5 h-3.5" />,
    color: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  create_titipan: {
    label: "Tambah Titipan",
    icon: <MessageSquareHeart className="w-3.5 h-3.5" />,
    color: "bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400 border-pink-200 dark:border-pink-800",
  },
  update_titipan: {
    label: "Edit Titipan",
    icon: <MessageSquareHeart className="w-3.5 h-3.5" />,
    color: "bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400 border-pink-200 dark:border-pink-800",
  },
  delete_titipan: {
    label: "Hapus Titipan",
    icon: <Trash2 className="w-3.5 h-3.5" />,
    color: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  create_shortlink: {
    label: "Tambah Shortlink",
    icon: <Link2 className="w-3.5 h-3.5" />,
    color: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border-teal-200 dark:border-teal-800",
  },
  update_shortlink: {
    label: "Edit Shortlink",
    icon: <Link2 className="w-3.5 h-3.5" />,
    color: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border-teal-200 dark:border-teal-800",
  },
  delete_shortlink: {
    label: "Hapus Shortlink",
    icon: <Trash2 className="w-3.5 h-3.5" />,
    color: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  other: {
    label: "Lainnya",
    icon: <Activity className="w-3.5 h-3.5" />,
    color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  },
};

const FILTER_OPTIONS = [
  { value: "", label: "Semua Aksi" },
  { value: "login", label: "Login" },
  { value: "approve_article", label: "Setujui Artikel" },
  { value: "reject_article", label: "Tolak Artikel" },
  { value: "update_article", label: "Edit Artikel" },
  { value: "delete_article", label: "Hapus Artikel" },
  { value: "create_kegiatan", label: "Tambah Event" },
  { value: "update_kegiatan", label: "Edit Event" },
  { value: "delete_kegiatan", label: "Hapus Event" },
  { value: "add_admin", label: "Tambah Admin" },
  { value: "update_admin", label: "Edit Admin" },
  { value: "delete_admin", label: "Hapus Admin" },
];

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ActivityLogTab() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  const fetchLogs = async (action?: string) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (action) params.set("action", action);
      params.set("limit", "100");

      const res = await fetch(`/api/admin/logs?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Gagal mengambil log.");

      setLogs(json.data?.logs || []);
      setCurrentEmail(json.data?.currentAdminEmail || "");
    } catch (err: any) {
      setError(err?.message || "Gagal memuat log aktivitas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    fetchLogs(value || undefined);
  };

  const getActionConfig = (action: string) => {
    return (
      ACTION_CONFIG[action] || {
        label: action,
        icon: <Activity className="w-3.5 h-3.5" />,
        color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-forest-600 dark:text-lime" />
            <h3 className="text-lg font-black text-forest-900 dark:text-white">
              Log Aktivitas Admin
            </h3>
            <span className="px-2 py-0.5 bg-forest-100 dark:bg-lime/20 text-forest-700 dark:text-lime rounded-full text-[10px] font-bold">
              {logs.length} entri
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="text-xs font-bold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-gray-700 dark:text-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-600/40 dark:focus:ring-lime/50"
              >
                {FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => fetchLogs(filter || undefined)}
              disabled={loading}
              className="p-1.5 text-forest-600 dark:text-lime hover:bg-forest-50 dark:hover:bg-lime/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Segarkan"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-xs font-bold">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Logs List */}
      <div className="space-y-2">
        {loading ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 text-center flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-forest-600 dark:text-lime" />
            <span className="text-xs font-bold text-gray-400">Memuat log...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 text-center">
            <span className="text-4xl mb-3 block">📋</span>
            <p className="text-sm font-bold text-gray-400 dark:text-gray-500">
              Belum ada aktivitas tercatat.
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const config = getActionConfig(log.action);
            const isSelf =
              currentEmail &&
              log.admin_email.toLowerCase() === currentEmail.toLowerCase();

            return (
              <div
                key={log.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-md transition-all flex items-start gap-3"
              >
                {/* Action Badge */}
                <div
                  className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${config.color}`}
                >
                  {config.icon}
                  <span className="hidden sm:inline">{config.label}</span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {log.admin_name || log.admin_email}
                    </span>
                    {isSelf && (
                      <span className="px-1.5 py-0.5 bg-forest-600 text-white rounded text-[9px] font-bold">
                        Anda
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                      {log.target_type && (
                        <>
                          {log.action.includes("approve") || log.action.includes("reject")
                            ? "→"
                            : log.action.includes("create")
                              ? "menambahkan"
                              : log.action.includes("update")
                                ? "mengedit"
                                : log.action.includes("delete")
                                  ? "menghapus"
                                  : log.action === "login"
                                    ? "masuk ke panel"
                                    : "→"}{" "}
                          {log.target_type}
                          {log.target_name && (
                            <span className="text-gray-500 dark:text-gray-400 font-medium">
                              {" "}
                              &ldquo;{log.target_name}&rdquo;
                            </span>
                          )}
                        </>
                      )}
                    </span>
                  </div>
                  {log.details && (
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                      {log.details}
                    </p>
                  )}
                </div>

                {/* Timestamp */}
                <div className="shrink-0 flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{formatRelativeTime(log.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
