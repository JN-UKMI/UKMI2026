"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Send, User, FileText, Tag, Image as ImageIcon, CheckCircle } from "lucide-react";

export default function TulisArtikelPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Kajian");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState(""); // Accept image URL for simplified integration
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/artikel/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          category,
          excerpt,
          content,
          coverUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengirimkan artikel");
      }

      setSuccess(true);
      // Reset form fields
      setTitle("");
      setAuthor("");
      setExcerpt("");
      setContent("");
      setCoverUrl("");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          href="/artikel"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-forest-600 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Artikel
        </Link>

        {success ? (
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center animate-fade-in">
            <div className="w-16 h-16 bg-lime/10 text-lime rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wide mb-3">
              Artikel Berhasil Dikirim!
            </h2>
            <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-8">
              Terima kasih atas kontribusi Anda. Artikel telah masuk ke database antrean moderasi Sanity. Artikel akan langsung muncul di website setelah disetujui oleh Admin.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 bg-forest-600 hover:bg-forest-800 text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
              >
                Tulis Artikel Lain
              </button>
              <Link
                href="/artikel"
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                Lihat Semua Artikel
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
            <header className="mb-8 border-b border-gray-150/60 pb-6">
              <h1 className="text-2xl md:text-3xl font-black text-forest-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-forest-600" />
                Tulis Artikel Baru
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-1">
                Kirimkan tulisan dakwah, liputan kegiatan bidang, atau opini kajian Anda.
              </p>
            </header>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg">
                ⚠️ Error: {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid 1: Title & Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="title" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-forest-600" />
                    Judul Artikel
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    placeholder="Contoh: Manfaat Membaca Al-Kahfi di Hari Jumat"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-forest-600 focus:outline-none transition-all font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="author" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-forest-600" />
                    Nama Penulis / Redaksi
                  </label>
                  <input
                    id="author"
                    type="text"
                    required
                    placeholder="Contoh: Departemen Media & Syiar"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-forest-600 focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Grid 2: Category & Cover Image URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="category" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-forest-600" />
                    Kategori
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:border-forest-600 focus:outline-none transition-all font-bold text-gray-700"
                  >
                    <option value="Kajian">Kajian (Artikel Keilmuan/Tafsir)</option>
                    <option value="Kegiatan">Kegiatan (Laporan/Liputan Acara)</option>
                    <option value="Isu">Isu (Analisis Kontemporer/Opini)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="coverUrl" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-forest-600" />
                    URL Gambar Sampul (Opsional)
                  </label>
                  <input
                    id="coverUrl"
                    type="url"
                    placeholder="https://example.com/gambar-artikel.jpg"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-forest-600 focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Textarea 1: Excerpt */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="excerpt" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-forest-600" />
                  Ringkasan Singkat (Excerpt)
                </label>
                <textarea
                  id="excerpt"
                  required
                  rows={2}
                  maxLength={250}
                  placeholder="Ringkasan singkat maksimal 250 karakter tentang isi artikel Anda..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-forest-600 focus:outline-none transition-all font-medium resize-y"
                />
              </div>

              {/* Textarea 2: Content */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="content" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-forest-600" />
                  Isi Lengkap Artikel
                </label>
                <textarea
                  id="content"
                  required
                  rows={8}
                  placeholder="Ketikkan seluruh isi materi kajian atau berita kegiatan Anda di sini..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-forest-600 focus:outline-none transition-all font-medium resize-y"
                />
              </div>

              {/* Submit Button */}
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
