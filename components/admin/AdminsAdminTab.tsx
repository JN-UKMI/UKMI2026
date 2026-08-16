"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  Edit2,
  Mail,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Lock,
} from "lucide-react";

interface AdminItem {
  id: string;
  email: string;
  role: string;
  isEnv: boolean;
  isDb: boolean;
  dbId: string | null;
  created_at: string | null;
}

export function AdminsAdminTab() {
  const [admins, setAdmins] = useState<AdminItem[]>([]);
  const [currentAdminEmail, setCurrentAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/admins");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal mengambil daftar admin.");
      setAdmins(json.data?.admins || []);
      setCurrentAdminEmail(json.data?.currentAdminEmail || "");
    } catch (err: any) {
      setError(err?.message || "Gagal memuat daftar admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    fetchAdmins();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setEmail("");
    setRole("Admin");
  };

  const handleStartEdit = (admin: AdminItem) => {
    setIsEditing(true);
    setEditingId(admin.id);
    setEmail(admin.email);
    setRole(admin.role || "Admin");
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Alamat email wajib diisi.");
      return;
    }

    setSubmitting(true);

    try {
      const url = "/api/admin/admins";
      const method = isEditing ? "PUT" : "POST";
      const payload = isEditing
        ? { id: editingId, email: email.trim().toLowerCase(), name: role.trim() }
        : { email: email.trim().toLowerCase(), name: role.trim() };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal memproses data admin.");

      setSuccess(
        isEditing
          ? "Data akun admin berhasil diperbarui!"
          : "Email admin baru berhasil ditambahkan!"
      );
      resetForm();
      fetchAdmins();
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat menyimpan data admin.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (admin: AdminItem) => {
    if (admin.email.toLowerCase() === currentAdminEmail.toLowerCase()) {
      alert("Anda tidak dapat menghapus akun email Anda sendiri.");
      return;
    }

    if (admin.isEnv && !admin.isDb) {
      alert(
        "Akun Super Admin sistem (.env) tidak dapat dihapus dari panel web."
      );
      return;
    }

    if (!confirm(`Hapus akses admin untuk "${admin.email}"?`)) return;

    setDeletingId(admin.id);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/admins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: admin.dbId || admin.id }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal menghapus admin.");

      setSuccess("Akses admin berhasil dicabut.");
      fetchAdmins();
    } catch (err: any) {
      setError(err?.message || "Gagal menghapus admin.");
    } finally {
      setDeletingId(null);
    }
  };

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

      {/* Form Tambah / Edit Admin */}
      <div className="bg-white dark:bg-gray-900 border-2 border-forest-600/30 dark:border-lime/30 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-forest-900 dark:text-lime flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit2 className="w-6 h-6 text-forest-600 dark:text-lime" />
                <span>Edit Akun Admin</span>
              </>
            ) : (
              <>
                <UserPlus className="w-6 h-6 text-forest-600 dark:text-lime" />
                <span>Tambah Email Admin Baru</span>
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
                Email Akun Google *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pengurus@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-forest-600/40 dark:focus:ring-lime/50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Role *
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-forest-600/40 dark:focus:ring-lime/50 focus:outline-none cursor-pointer"
                >
                  <option value="Admin">Admin</option>
                  <option value="Ketua Umum">Ketua Umum</option>
                  <option value="Sekretaris Umum">Sekretaris Umum</option>
                  <option value="Bendahara Umum">Bendahara Umum</option>
                  <option value="Bidang Syiar">Bidang Syiar</option>
                  <option value="Bidang Internal">Bidang Internal</option>
                  <option value="Bidang Eksternal">Bidang Eksternal</option>
                  <option value="Bidang Media">Bidang Media</option>
                  <option value="Bidang Kemuslimahan">Bidang Kemuslimahan</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
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
                  <UserPlus className="w-4 h-4" />
                  <span>Beri Akses Admin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Daftar Admin */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-forest-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-forest-600 dark:text-lime" />
            <span>Daftar Akun Admin ({admins.length})</span>
          </h3>
          <button
            onClick={fetchAdmins}
            className="text-xs font-bold text-forest-600 dark:text-lime hover:underline cursor-pointer"
          >
            Segarkan
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600 dark:text-lime" />
            <span className="text-xs font-bold">Memuat daftar admin...</span>
          </div>
        ) : admins.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm font-semibold">
            Belum ada akun admin terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-800 text-gray-400 uppercase text-[10px] sm:text-xs">
                <tr>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
                {admins.map((item) => {
                  const isSelf =
                    item.email.toLowerCase() === currentAdminEmail.toLowerCase();

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      {/* Kolom 1: Email */}
                      <td className="py-3.5 px-3 font-bold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>{item.email}</span>
                          {isSelf && (
                            <span className="px-2 py-0.5 bg-forest-600 text-white rounded-md text-[10px] font-bold">
                              Anda
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Kolom 2: Role */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-3 py-1 bg-forest-100 text-forest-800 dark:bg-lime/20 dark:text-lime rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                          <Shield className="w-3 h-3" />
                          <span>{item.role || "Admin"}</span>
                        </span>
                      </td>

                      {/* Kolom 3: Aksi (Edit & Hapus) */}
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {/* Tombol Edit */}
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-lime hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit Role / Email"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Tombol Hapus */}
                          {isSelf ? (
                            <span
                              className="p-1.5 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                              title="Akun sedang digunakan"
                            >
                              <Lock className="w-4 h-4 inline-block" />
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDeleteAdmin(item)}
                              disabled={deletingId === item.id}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                              title="Hapus Akses Admin"
                            >
                              {deletingId === item.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
