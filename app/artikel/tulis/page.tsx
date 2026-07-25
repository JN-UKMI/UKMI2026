"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Send, User, FileText, Tag, Upload, CheckCircle, Lock, Calendar, X, ShieldCheck, Eye, EyeOff, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Quote, Link2 } from "lucide-react";

export default function TulisArtikelPage() {
  const [passcode, setPasscode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Kajian");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  // Image File & Preview state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Restore verification state from session storage
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

    // Strict Client Validation: ALL FIELDS ARE MANDATORY INCLUDING COVER IMAGE
    if (
      !title.trim() ||
      !author.trim() ||
      !publishedAt.trim() ||
      !category.trim() ||
      !excerpt.trim() ||
      !content.trim() ||
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
        content,
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
      // Reset form fields
      setTitle("");
      setAuthor("");
      setPublishedAt(new Date().toISOString().split("T")[0]);
      setCategory("Kajian");
      setExcerpt("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi server");
    } finally {
      setLoading(false);
    }
  };

  // GATEKEEPER SCREEN (If passcode is not verified yet)
  if (!isVerified) {
    return (
      <div className="bg-transparent min-h-[85vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-forest-600/10 text-forest-600 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-forest-900 uppercase tracking-wider mb-2">
            Akses Pengurus
          </h1>
          <p className="text-xs text-gray-400 font-semibold mb-8">
            Silakan masukkan Kode Akses Pengurus terlebih dahulu sebelum membuka form tulis artikel.
          </p>

          {verifyError && (
            <div className="mb-6 p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg text-left">
              ⚠️ {verifyError}
            </div>
          )}

          <form onSubmit={handleVerifyGate} className="space-y-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="passcodeGate" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
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
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 text-sm focus:border-forest-600 focus:outline-none transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
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

          <Link href="/artikel" className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-bold hover:text-forest-600 transition-colors mt-6">
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Artikel
          </Link>
        </div>
      </div>
    );
  }

  // MAIN FORM SCREEN (Visible after verification)
  return (
    <div className="bg-transparent min-h-screen py-12 px-4 md:px-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Back Button & Auth Badge */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-forest-600 dark:hover:text-lime transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Artikel
          </Link>

          <span className="px-3 py-1 bg-lime/10 border border-lime/30 text-forest-900 dark:text-lime rounded-full text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
            Akses Pengurus Terverifikasi
          </span>
        </div>

        {/* Hero Guidance Banner */}
        <div className="bg-gradient-to-br from-forest-900 via-forest-800 to-black text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-lime/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime/20 border border-lime/40 rounded-full text-lime text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              Kirim Karya & Artikel Dakwah
            </div>

            <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
              KIRIM ARTIKEL KARYA JN UKMI UNS
            </h1>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-3xl">
              Punya gagasan kreatif dan opini kritis yang ingin dibagikan? Ada inspirasi dakwah atau kisah pengabdian kampus yang sayang jika hanya menjadi kenangan? Atau punya keresahan Islami yang ingin dituangkan menjadi tulisan bermakna?
            </p>

            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex items-start gap-3.5 mt-4">
              <Image
                src="/image/logo-jnukmi.svg"
                alt="JN UKMI UNS Logo"
                width={48}
                height={48}
                className="w-12 h-auto shrink-0 mt-0.5"
              />
              <div className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                <strong className="text-white font-bold block mb-1">JN UKMI (Jamaah Nurul Huda UKMI UNS)</strong>
                Hadir sebagai wadah inklusif dan solutif untuk menyalurkan gagasan, inspirasi dakwah, cerita perjuangan, dan opini kritis mahasiswa Muslim UNS. Melalui tulisan ini, Anda dapat menyebarkan kebaikan, menginspirasi ribuan civitas akademika, dan mencetak karya abadi.
              </div>
            </div>
          </div>
        </div>

        {/* Ketentuan Penulisan Artikel JN UKMI UNS */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 dark:border-gray-800 mb-8 space-y-6 transition-colors">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <h2 className="text-xl font-black text-forest-900 dark:text-lime flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-forest-600 dark:text-lime" />
              Ketentuan & Syarat Penulisan Artikel JN UKMI UNS
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Setiap naskah yang dikirimkan wajib mematuhi 8 panduan penulisan berikut agar lolos kurasi Tim Media & Syiar JN UKMI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Ketentuan 1 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-forest-900 dark:text-lime text-sm">
                <span className="w-6 h-6 rounded-lg bg-forest-600 dark:bg-forest-700 text-white flex items-center justify-center text-xs shrink-0">1</span>
                Kaidah Penulisan & Bahasa
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Naskah menggunakan Bahasa Indonesia yang baik dan benar sesuai standar Ejaan yang Disempurnakan (EYD V). Struktur paragraf dibuat rapi, komunikatif, dan tidak bertele-tele.
              </p>
            </div>

            {/* Ketentuan 2 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-forest-900 dark:text-lime text-sm">
                <span className="w-6 h-6 rounded-lg bg-forest-600 dark:bg-forest-700 text-white flex items-center justify-center text-xs shrink-0">2</span>
                Panjang Pembahasan Artikel
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Panjang artikel berada di rentang <strong className="text-forest-700 dark:text-lime">400 hingga 1.000 kata</strong>. Isi tulisan mengusung ide yang padat, argumen yang jelas, dan poin-poin yang mudah dipahami pembaca.
              </p>
            </div>

            {/* Ketentuan 3 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-forest-900 dark:text-lime text-sm">
                <span className="w-6 h-6 rounded-lg bg-forest-600 dark:bg-forest-700 text-white flex items-center justify-center text-xs shrink-0">3</span>
                Kategori & Relevansi Isu
              </div>
              <ul className="text-gray-600 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-0.5">
                <li><strong className="text-gray-800 dark:text-gray-200">Kajian:</strong> Pemikiran Islam, fiqih, tafsir, & nilai spiritualitas.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Kegiatan:</strong> Liputan pergerakan dakwah & agenda JN UKMI.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Isu:</strong> Opini kebangsaan, isu keumatan, & kehidupan mahasiswa.</li>
              </ul>
            </div>

            {/* Ketentuan 4 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-forest-900 dark:text-lime text-sm">
                <span className="w-6 h-6 rounded-lg bg-forest-600 dark:bg-forest-700 text-white flex items-center justify-center text-xs shrink-0">4</span>
                Gaya Bahasa & Keadaban
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Gaya penulisan santai, kreatif, dan inspiratif. Dilarang keras memuat konten yang mengandung unsur SARA, hoaks, ujaran kebencian, tuduhan tanpa dasar, atau pelecehan personal.
              </p>
            </div>

            {/* Ketentuan 5 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-forest-900 dark:text-lime text-sm">
                <span className="w-6 h-6 rounded-lg bg-forest-600 dark:bg-forest-700 text-white flex items-center justify-center text-xs shrink-0">5</span>
                Gambar Sampul & Lisensi Media
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Setiap tulisan wajib melampirkan 1 gambar sampul berasio 16:9 (Maksimal 5MB, format JPG/PNG/WEBP) yang bebas hak cipta atau milik sendiri dan relevan dengan topik.
              </p>
            </div>

            {/* Ketentuan 6 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-forest-900 dark:text-lime text-sm">
                <span className="w-6 h-6 rounded-lg bg-forest-600 dark:bg-forest-700 text-white flex items-center justify-center text-xs shrink-0">6</span>
                Dua Opsi Metode Pengiriman
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                <strong>Opsi A (Rekomendasi Utama):</strong> Mengisi formulir web langsung di bawah.<br />
                <strong>Opsi B (Email):</strong> Kirim file Word/Docs ke <span className="font-bold text-forest-700 dark:text-lime">media.jnukmi.uns@gmail.com</span> subjek: <code className="font-mono text-[10px] bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">[ARTIKEL UKMI] Nama - Judul</code>.
              </p>
            </div>

            {/* Ketentuan 7 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-forest-900 dark:text-lime text-sm">
                <span className="w-6 h-6 rounded-lg bg-forest-600 dark:bg-forest-700 text-white flex items-center justify-center text-xs shrink-0">7</span>
                Orisinalitas & Etika Karya
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Tulisan harus murni karya pribadi asli (bukan jiplakan/plagiasi). Tanggung jawab ilmiah dan hukum atas isi tulisan sepenuhnya berada pada penulis.
              </p>
            </div>

            {/* Ketentuan 8 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-forest-900 dark:text-lime text-sm">
                <span className="w-6 h-6 rounded-lg bg-forest-600 dark:bg-forest-700 text-white flex items-center justify-center text-xs shrink-0">8</span>
                Proses Moderasi & Editing
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Tim Media & Syiar JN UKMI melakukan peninjauan dalam kurun waktu 1 s/d 7 hari kerja. Tim berhak menyunting judul & tata bahasa tanpa mengubah makna utama tulisan.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container Title */}
        <div className="mb-4">
          <h2 className="text-lg font-black text-forest-900 dark:text-lime uppercase tracking-wider flex items-center gap-2">
            <Send className="w-5 h-5 text-forest-600 dark:text-lime" />
            Formulir Pengiriman Artikel Instan
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Isi seluruh field di bawah ini secara lengkap untuk masuk ke antrean moderasi Admin JN UKMI.
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center animate-fade-in">
            <div className="w-16 h-16 bg-lime/10 text-lime rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wide mb-3">
              Artikel Berhasil Dikirim!
            </h2>
            <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-8">
              Terima kasih atas kontribusi Anda. Gambar dan artikel telah masuk ke database antrean moderasi Sanity. Artikel akan langsung muncul di website setelah disetujui oleh Admin.
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
                Seluruh kolom dan gambar sampul wajib diisi/diunggah sebelum dikirimkan.
              </p>
            </header>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: Judul Artikel (1 Baris Utuh / Full Width) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="title" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-forest-600 focus:outline-none transition-all font-bold text-gray-900"
                />
              </div>

              {/* SECTION 2: Tengah (Kiri: 3 Form Bertumpuk Kebawah, Kanan: Kotak Card Upload Gambar) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Kolom Kiri: 3 Form Stacked (Penulis, Tanggal, Kategori) */}
                <div className="md:col-span-6 space-y-4">
                  {/* 1. Nama Penulis */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="author" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-forest-600" />
                      Nama Penulis / Redaksi <span className="text-red-500">*</span>
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

                  {/* 2. Tanggal Penulisan */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="publishedAt" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-forest-600" />
                      Tanggal Penulisan <span className="text-red-500">*</span>
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

                  {/* 3. Pilihan Kategori */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="category" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-forest-600" />
                      Pilihan Kategori <span className="text-red-500">*</span>
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
                      <option value="Lainnya">Lainnya (Pengumuman/Rilis/Lain-lain)</option>
                    </select>
                  </div>
                </div>

                {/* Kolom Kanan: Kotak Card Besar Upload Gambar */}
                <div className="md:col-span-6 h-full flex flex-col">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                    <Upload className="w-3.5 h-3.5 text-forest-600" />
                    Upload Gambar Sampul <span className="text-red-500">*</span>
                  </label>

                  <div className={`relative flex-1 min-h-[220px] border-2 border-dashed rounded-2xl bg-gray-50/50 hover:bg-forest-50/10 transition-all flex flex-col items-center justify-center p-4 text-center group overflow-hidden ${
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
                        <span className="text-sm font-bold text-gray-800 mb-1">
                          Klik untuk Unggah Gambar <span className="text-red-500">*</span>
                        </span>
                        <span className="text-xs text-gray-400 font-medium max-w-xs">
                          Format JPG, PNG, atau WEBP (Maksimal 5MB)
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
              </div>

              {/* SECTION 3: Ringkasan Singkat (Full Width) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="excerpt" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-forest-600" />
                  Ringkasan Singkat (Excerpt) <span className="text-red-500">*</span>
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

              {/* SECTION 4: Isi Lengkap Artikel (Full Width) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="content" className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-forest-600" />
                  Isi Lengkap Artikel <span className="text-red-500">*</span>
                </label>
                {/* WYSIWYG Rich Text Editor (Word/GDocs-style) */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col focus-within:border-forest-600 transition-colors">
                  {/* Toolbar */}
                  <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200 items-center select-none">
                    <button
                      type="button"
                      onClick={() => document.execCommand("bold", false)}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-forest-50 border border-gray-200 hover:border-forest-300 text-gray-700 hover:text-forest-600 rounded-lg transition-all cursor-pointer"
                      title="Tebal (Bold)"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => document.execCommand("italic", false)}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-forest-50 border border-gray-200 hover:border-forest-300 text-gray-700 hover:text-forest-600 rounded-lg transition-all cursor-pointer"
                      title="Miring (Italic)"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => document.execCommand("underline", false)}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-forest-50 border border-gray-200 hover:border-forest-300 text-gray-700 hover:text-forest-600 rounded-lg transition-all cursor-pointer"
                      title="Garis Bawah (Underline)"
                    >
                      <Underline className="w-4 h-4" />
                    </button>

                    <div className="w-[1px] h-6 bg-gray-200 mx-1" />

                    <select
                      onChange={(e) => {
                        if (e.target.value !== "") {
                          document.execCommand("formatBlock", false, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className="h-8 px-2 bg-white hover:bg-forest-50 border border-gray-200 hover:border-forest-300 text-xs font-bold text-gray-700 rounded-lg transition-all cursor-pointer outline-none"
                      title="Sub-judul (Heading)"
                    >
                      <option value="">Format teks...</option>
                      <option value="H1">Judul Utama (H1)</option>
                      <option value="H2">Sub-judul Besar (H2)</option>
                      <option value="H3">Sub-judul Sedang (H3)</option>
                      <option value="H4">Sub-judul Kecil (H4)</option>
                      <option value="P">Paragraf Normal</option>
                    </select>

                    <div className="w-[1px] h-6 bg-gray-200 mx-1" />

                    <button
                      type="button"
                      onClick={() => document.execCommand("justifyLeft", false)}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-forest-50 border border-gray-200 hover:border-forest-300 text-gray-700 hover:text-forest-600 rounded-lg transition-all cursor-pointer"
                      title="Rata Kiri"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => document.execCommand("justifyCenter", false)}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-forest-50 border border-gray-200 hover:border-forest-300 text-gray-700 hover:text-forest-600 rounded-lg transition-all cursor-pointer"
                      title="Rata Tengah"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => document.execCommand("justifyRight", false)}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-forest-50 border border-gray-200 hover:border-forest-300 text-gray-700 hover:text-forest-600 rounded-lg transition-all cursor-pointer"
                      title="Rata Kanan"
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => document.execCommand("justifyFull", false)}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-forest-50 border border-gray-200 hover:border-forest-300 text-gray-700 hover:text-forest-600 rounded-lg transition-all cursor-pointer"
                      title="Rata Kiri Kanan"
                    >
                      <AlignJustify className="w-4 h-4" />
                    </button>

                    <div className="w-[1px] h-6 bg-gray-200 mx-1" />

                    <button
                      type="button"
                      onClick={() => document.execCommand("insertUnorderedList", false)}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-forest-50 border border-gray-200 hover:border-forest-300 text-gray-700 hover:text-forest-600 rounded-lg transition-all cursor-pointer"
                      title="Daftar Poin (Bullet List)"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => document.execCommand("insertOrderedList", false)}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-forest-50 border border-gray-200 hover:border-forest-300 text-gray-700 hover:text-forest-600 rounded-lg transition-all cursor-pointer"
                      title="Daftar Angka (Ordered List)"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>

                    <div className="w-[1px] h-6 bg-gray-200 mx-1" />

                    <button
                      type="button"
                      onClick={() => document.execCommand("formatBlock", false, "BLOCKQUOTE")}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-forest-50 border border-gray-200 hover:border-forest-300 text-gray-700 hover:text-forest-600 rounded-lg transition-all cursor-pointer"
                      title="Kutipan Ayat / Hadits (Blockquote)"
                    >
                      <Quote className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt("Masukkan URL Tautan (Contoh: https://example.com) :");
                        if (url) {
                          document.execCommand("createLink", false, url);
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-white hover:bg-forest-50 border border-gray-200 hover:border-forest-300 text-gray-700 hover:text-forest-600 rounded-lg transition-all cursor-pointer"
                      title="Sisipkan Link Tautan"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div
                    id="content-editor"
                    contentEditable
                    spellCheck={false}
                    suppressContentEditableWarning
                    onBlur={(e) => setContent(e.currentTarget.innerHTML)}
                    onInput={(e) => setContent(e.currentTarget.innerHTML)}
                    className="w-full px-4 py-4 min-h-[320px] focus:outline-none text-sm text-gray-800 prose prose-sm max-w-none"
                  />
                </div>

                <p className="text-[11px] text-gray-400 font-medium">
                  💡 <b>Tips:</b> Anda bisa langsung memblok teks untuk menebalkan (B), memiringkan (I), atau membuat daftar poin/angka seperti di Word.
                </p>
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
                    Mengirimkan Artikel & Mengunggah Gambar...
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
