"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, BookOpen, Send, User, FileText, Tag, Upload, CheckCircle, Lock, Calendar, X, ShieldCheck, Eye, EyeOff } from "lucide-react";
import NovelEditor from "@/components/editor/NovelEditor";
import { TransitionLink } from "@/components/ui/TransitionLink";

export default function TulisArtikelPage() {
  const [passcode, setPasscode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Artikel Islami");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedPasscode = sessionStorage.getItem("pengurus_passcode");
    if (savedPasscode) {
      setPasscode(savedPasscode);
      setIsVerified(true);
    }
  }, []);

  const handleVerifyGate = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyLoading(true);
    setVerifyError("");

    try {
      const res = await fetch("/api/artikel/verify-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Kode Akses salah.");
      }

      setIsVerified(true);
      sessionStorage.setItem("pengurus_passcode", passcode);
    } catch (err: any) {
      setVerifyError(err.message || "Gagal memverifikasi kode akses.");
      setIsVerified(false);
      sessionStorage.removeItem("pengurus_passcode");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Silakan pilih file gambar yang valid (JPG, PNG, WEBP).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran gambar maksimal adalah 5MB.");
        return;
      }
      setError("");
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !title.trim() ||
      !author.trim() ||
      !publishedAt.trim() ||
      !category.trim() ||
      !excerpt.trim() ||
      !contentHtml.trim() ||
      !imageFile ||
      !imagePreview
    ) {
      setError("Seluruh kolom form dan Gambar Sampul Wajib diisi/diunggah!");
      return;
    }

    setLoading(true);

    try {
      const bodyPayload = {
        title,
        author,
        publishedAt,
        category,
        passcode,
        excerpt,
        content: contentHtml,
        imageName: imageFile.name,
        imageBase64: imagePreview,
      };

      const res = await fetch("/api/artikel/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengirimkan artikel");
      }

      setSuccess(true);
      setTitle("");
      setAuthor("");
      setPublishedAt(new Date().toISOString().split("T")[0]);
      setCategory("Artikel Islami");
      setExcerpt("");
      setContentHtml("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi server");
    } finally {
      setLoading(false);
    }
  };

  if (!isVerified) {
    return (
    <div className="bg-transparent min-h-[85vh] flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gray-800 max-w-md w-full text-center transition-colors">
          <div className="w-16 h-16 bg-forest-600/10 text-forest-600 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-forest-900 uppercase tracking-wider mb-2">
            Akses Pengurus
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-8">
            Silakan masukkan Kode Akses Pengurus terlebih dahulu sebelum membuka form tulis artikel.
          </p>

          {verifyError && (
            <div className="mb-6 p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg text-left">
              ⚠️ {verifyError}
            </div>
          )}

          <form onSubmit={handleVerifyGate} className="space-y-4" id="passcodeForm">
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="passcodeGate" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-forest-600" />
                Kode Akses Pengurus
              </label>
              <div className="relative w-full">
                <input
                  id="passcodeGate"
                  type={showPasscode ? "text" : "password"}
                  required
                  placeholder="Tanya Admin"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:border-forest-600 focus:outline-none transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  autoComplete="off"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={verifyLoading}
              className={`w-full py-3.5 px-6 rounded-full text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                verifyLoading
                  ? "bg-gray-400 cursor-not-allowed shadow-none"
                  : "bg-forest-600 hover:bg-forest-800 hover:shadow-lg"
              }`}
            >
              {verifyLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Memverifikasi Kode Akses...
                </>
              ) : (
                "Buka Form Tulis Artikel"
              )}
            </button>
          </form>
          <TransitionLink href="/artikel" className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-bold hover:text-forest-600 dark:hover:text-lime transition-colors mt-6">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Artikel
          </TransitionLink>
        </div>
      </div>
    );
  }

  return (        <div className="bg-transparent min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <TransitionLink
            href="/artikel"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-forest-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Artikel
          </TransitionLink>

          <span className="px-3 py-1 bg-lime/10 border border-lime/30 text-forest-900 rounded-full text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
            Akses Pengurus Terverifikasi
          </span>
        </div>

        {success ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-800 text-center flex flex-col items-center justify-center transition-colors">
            <div className="w-16 h-16 bg-lime/10 text-lime rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wide mb-3">
              Artikel Berhasil Dikirim!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md leading-relaxed mb-8">
              Terima kasih atas kontribusi Anda. Artikel telah masuk ke database antrean moderasi Sanity. Artikel akan langsung muncul di website setelah disetujui oleh Admin.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 bg-forest-600 hover:bg-forest-800 text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
              >
                Tulis Artikel Lain
              </button>
              <TransitionLink
                href="/artikel"
                className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                Lihat Semua Artikel
              </TransitionLink>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gray-800 space-y-6 transition-colors">
            <div className="border-b border-gray-150/60 pb-6">
              <h1 className="text-2xl md:text-3xl font-black text-forest-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-forest-600" />
                Tulis Artikel Baru
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
                Seluruh kolom dan gambar sampul wajib diisi sebelum dikirimkan.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="title" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-forest-600" />
                  Judul Artikel <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="Contoh: Manfaat Membaca Al-Kahfi di Hari Jumat"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm focus:border-forest-600 focus:outline-none transition-all font-bold bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="author" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-forest-600" />
                    Penulis <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="author"
                    type="text"
                    required
                    placeholder="Departemen Media & Syiar"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm bg-white dark:bg-gray-950 focus:border-forest-600 focus:outline-none transition-all font-medium text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="publishedAt" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-forest-600" />
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="publishedAt"
                    type="date"
                    required
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-forest-600 focus:outline-none transition-all font-medium bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="category" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-forest-600" />
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm bg-white dark:bg-gray-950 focus:border-forest-600 focus:outline-none transition-all font-bold text-gray-700 dark:text-gray-200"
                  >
                    <option value="Artikel Islami">Artikel Islami</option>
                    <option value="Kajian Islami">Kajian Islami</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-forest-600" />
                  Gambar Sampul <span className="text-red-500">*</span>
                </label>

                <div className={`relative min-h-[220px] border-2 border-dashed rounded-2xl bg-gray-50/50 hover:bg-forest-50/10 transition-all flex flex-col items-center justify-center p-4 text-center group overflow-hidden ${
                  !imageFile ? "border-amber-300 hover:border-forest-600" : "border-forest-600"
                }`}>
                  {imagePreview ? (
                    <div className="relative w-full h-full min-h-[200px] rounded-xl overflow-hidden group">
                      <Image
                        src={imagePreview}
                        alt="Preview Sampul"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors z-10 cursor-pointer"
                        title="Hapus Gambar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Upload className="w-6 h-6 text-forest-600" />
                      </div>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
                        Klik untuk Unggah Gambar
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                        JPG, PNG, WEBP (Max 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="excerpt" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-forest-600" />
                  Ringkasan Singkat <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="excerpt"
                  required
                  rows={2}
                  maxLength={250}
                  placeholder="Ringkasan singkat maksimal 250 karakter..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm bg-white dark:bg-gray-950 focus:border-forest-600 focus:outline-none transition-all font-medium resize-y text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500">{excerpt.length}/250</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-forest-600" />
                  Isi Artikel <span className="text-red-500">*</span>
                </label>
                <NovelEditor
                  onChange={(html) => setContentHtml(html)}
                  uploadFn={async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("passcode", passcode);
                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    });
                    if (!res.ok) throw new Error("Gagal upload");
                    const data = await res.json();
                    return data.url;
                  }}
                />
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  💡 Gunakan {"/"} untuk melihat menu perintah (heading, list, blockquote, dll)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-6 rounded-full text-sm font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed shadow-none"
                    : "bg-forest-600 hover:bg-forest-800 hover:shadow-lg"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Mengirimkan Artikel...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Artikel Ke Moderasi
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
