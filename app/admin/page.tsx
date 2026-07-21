"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, Check, Trash2, Calendar, User, Tag, AlertCircle } from "lucide-react";

interface DraftArticle {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  author?: string;
}

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [drafts, setDrafts] = useState<DraftArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  // Authenticate user with local storage cache for convenience
  useEffect(() => {
    const cachedPass = sessionStorage.getItem("admin_passcode");
    if (cachedPass) {
      setPasscode(cachedPass);
      fetchDrafts(cachedPass);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    fetchDrafts(passcode);
  };

  const fetchDrafts = async (pass: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal masuk ke panel admin.");
      }

      setDrafts(data.drafts || []);
      setIsFallbackMode(!!data.fallback);
      setIsAuthorized(true);
      sessionStorage.setItem("admin_passcode", pass);
    } catch (err: any) {
      setError(err.message || "Gagal memproses otorisasi.");
      setIsAuthorized(false);
      sessionStorage.removeItem("admin_passcode");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (draftId: string) => {
    setError("");
    setSuccessMsg("");
    setActionLoadingId(draftId);

    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId, passcode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mempublikasikan artikel.");
      }

      setSuccessMsg(data.message || "Artikel berhasil dipublikasikan!");
      // Remove approved item from list
      setDrafts((prev) => prev.filter((d) => d._id !== draftId));
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
        body: JSON.stringify({ draftId, passcode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menolak draf artikel.");
      }

      setSuccessMsg(data.message || "Artikel berhasil ditolak & dihapus.");
      // Remove rejected item from list
      setDrafts((prev) => prev.filter((d) => d._id !== draftId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLogout = () => {
    setPasscode("");
    setIsAuthorized(false);
    setDrafts([]);
    sessionStorage.removeItem("admin_passcode");
  };

  if (!isAuthorized) {
    return (
      <div className="bg-gray-50 min-h-[85vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-forest-600/10 text-forest-600 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-forest-900 uppercase tracking-wider mb-2">
            Moderasi Admin
          </h1>
          <p className="text-xs text-gray-400 font-semibold mb-8">
            Verifikasi kode akses pengurus untuk mengelola antrean draf artikel.
          </p>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg text-left">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="passcode" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-forest-600" />
                Kode Akses Moderasi
              </label>
              <input
                id="passcode"
                type="password"
                required
                placeholder="Masukkan PIN / Sandi Pengurus"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-forest-600 focus:outline-none transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-6 rounded-full text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed shadow-none"
                  : "bg-forest-600 hover:bg-forest-800 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                "Masuk Ke Panel Moderasi"
              )}
            </button>
          </form>

          <Link href="/artikel" className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-bold hover:text-forest-600 transition-colors mt-6">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Artikel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-forest-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Artikel
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-200 rounded-full text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all cursor-pointer"
          >
            Keluar Panel
          </button>
        </div>

        {/* Panel Title */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-forest-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-forest-600 animate-pulse" />
              Panel Moderasi Artikel
            </h1>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Tinjau, setujui, or tolak artikel yang dikirimkan oleh kontributor sebelum dipublikasikan.
            </p>
          </div>
          <span className="px-3.5 py-1.5 bg-forest-50 border border-forest-150 rounded-full text-xs font-bold text-forest-600">
            Draf Antrean: {drafts.length}
          </span>
        </div>

        {/* Fallback Banner Alert */}
        {isFallbackMode && (
          <div className="mb-6 p-4 bg-lime/10 border border-lime/30 rounded-2xl flex gap-3 text-forest-900 text-xs font-bold leading-relaxed items-center">
            <AlertCircle className="w-5 h-5 text-forest-600 shrink-0" />
            <span>
              Mode Simulasi Aktif: Server belum terhubung ke database live Sanity (SANITY_WRITE_TOKEN kosong). Menampilkan data dummy antrean. Klik "Setujui" or "Tolak" akan mensimulasikan aksi secara instan.
            </span>
          </div>
        )}

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

        {/* Drafts List */}
        <div className="space-y-6">
          {drafts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 shadow-md border border-gray-100 text-center flex flex-col items-center justify-center">
              <span className="text-5xl mb-4">🎉</span>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-2">
                Antrean Kosong!
              </h2>
              <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
                Semua draf artikel kontributor telah ditinjau dan dipublikasikan. Tidak ada antrean tertunda saat ini.
              </p>
            </div>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft._id}
                className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="flex-1 space-y-3.5">
                  {/* Category Badge & Date */}
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 bg-forest-50 border border-forest-150 rounded text-[10px] font-bold text-forest-600 uppercase tracking-wide">
                      {draft.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-forest-600" />
                      {new Date(draft.publishedAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {draft.author && (
                      <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-forest-600" />
                        oleh {draft.author}
                      </span>
                    )}
                  </div>

                  {/* Title & Excerpt */}
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight">
                      {draft.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 mt-2 leading-relaxed">
                      {draft.excerpt}
                    </p>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex md:flex-col items-center justify-end gap-2.5 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  {/* Approve */}
                  <button
                    disabled={actionLoadingId !== null}
                    onClick={() => handleApprove(draft._id)}
                    className="flex-1 md:flex-none w-full px-4 py-2 bg-forest-600 hover:bg-forest-800 text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Setujui
                  </button>

                  {/* Reject */}
                  <button
                    disabled={actionLoadingId !== null}
                    onClick={() => handleReject(draft._id)}
                    className="flex-1 md:flex-none w-full px-4 py-2 bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-full text-xs font-bold transition-all border border-gray-200 hover:border-red-100 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Tolak
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
