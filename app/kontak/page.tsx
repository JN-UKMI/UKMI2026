"use client";

import { useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import contactData from "@/content/kontak/main.json";
import { MessageSquare, Mail, AtSign, MapPin, Send } from "lucide-react";

export default function KontakPage() {
  const [activeTab, setActiveTab] = useState<"wa" | "email" | "ig">("wa");
  const [formData, setFormData] = useState({
    nama: "",
    instansi: "",
    perihal: "Media Partner & Kerjasama",
    pesan: "",
  });

  const waPhone = contactData.phone.replace(/[^0-9]/g, "");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "wa") {
      const waMessage = `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nHalo JN UKMI UNS,\nSaya *${formData.nama || "[Nama Anda]"}* dari *${formData.instansi || "[Nama Instansi/Komunitas]"}*.\n\n*Perihal:* ${formData.perihal}\n*Pesan / Detail:* \n${formData.pesan || "Mohon arahan dan info lebih lanjut."}\n\nTerima kasih.`;
      window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`, "_blank");
    } else if (activeTab === "email") {
      const subject = `[Kontak Website JN UKMI] ${formData.perihal} - ${formData.nama || "Pengunjung"}`;
      const body = `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nHalo Pengurus JN UKMI UNS,\n\nSaya ${formData.nama} dari ${formData.instansi}.\nPerihal: ${formData.perihal}\n\nPesan:\n${formData.pesan}\n\nTerima kasih.`;
      window.location.href = `mailto:${contactData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else if (activeTab === "ig") {
      const igMessage = `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nHalo JN UKMI UNS,\nSaya ${formData.nama || "[Nama]"} dari ${formData.instansi || "[Instansi]"}.\nPerihal: ${formData.perihal}\n\nPesan:\n${formData.pesan || "Mohon info dan arahan."}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(igMessage);
      }
      window.open("https://ig.me/m/jnukmiuns", "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <PageHero
        badge="Hubungi Pengurus"
        title="Hubungi Kami"
        subtitle="Kami siap melayani pertanyaan, saran, dan koordinasi syiar dakwah"
      />

      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-10 animate-[fadeIn_0.5s_ease-out]">
        {/* Main Interactive Form Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl p-6 sm:p-8 md:p-10 flex flex-col gap-8 transition-colors duration-300">
          {/* Header & Description */}
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Kirim Pesan & Pengajuan
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
              Pilih platform komunikasi yang Anda inginkan, lengkapi formulir di bawah ini untuk terhubung langsung dengan pengurus JN UKMI UNS.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-gray-100/80 dark:bg-gray-800/60 p-1.5 rounded-2xl border border-gray-200/60 dark:border-gray-700/60">
            {/* WhatsApp Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("wa")}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "wa"
                  ? "bg-white dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 shadow-md border border-emerald-100 dark:border-emerald-800/80"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            {/* Email Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("email")}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "email"
                  ? "bg-white dark:bg-forest-950/80 text-forest-800 dark:text-lime shadow-md border border-forest-100 dark:border-forest-800/80"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
              }`}
            >
              <Mail className="w-4 h-4 text-forest-600 dark:text-lime" />
              <span>Email</span>
            </button>

            {/* Instagram Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("ig")}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "ig"
                  ? "bg-white dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 shadow-md border border-pink-100 dark:border-pink-800/80"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50"
              }`}
            >
              <AtSign className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span>Instagram</span>
            </button>
          </div>

          {/* Form Element */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Row 1: Nama & Instansi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  required
                  suppressHydrationWarning
                  placeholder="Masukkan nama Anda"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 text-gray-900 dark:text-white focus:border-forest-600 dark:focus:border-lime focus:ring-2 focus:ring-forest-600/20 dark:focus:ring-lime/20 text-sm font-medium outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Instansi / Organisasi / Komunitas
                </label>
                <input
                  type="text"
                  name="instansi"
                  suppressHydrationWarning
                  placeholder="Contoh: BEM UNS, UKM Kerohanian"
                  value={formData.instansi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 text-gray-900 dark:text-white focus:border-forest-600 dark:focus:border-lime focus:ring-2 focus:ring-forest-600/20 dark:focus:ring-lime/20 text-sm font-medium outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Row 2: Perihal */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Perihal Kontak / Pengajuan <span className="text-rose-500">*</span>
              </label>
              <select
                name="perihal"
                suppressHydrationWarning
                value={formData.perihal}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 text-gray-900 dark:text-white focus:border-forest-600 dark:focus:border-lime focus:ring-2 focus:ring-forest-600/20 dark:focus:ring-lime/20 text-sm font-semibold outline-none transition-all cursor-pointer"
              >
                <option value="Media Partner & Kerjasama">🤝 Media Partner & Kerjasama Publikasi</option>
                <option value="Pertanyaan Umum & Informasi">❓ Pertanyaan Umum & Informasi Kegiatan</option>
                <option value="Undangan Pembicara / Acara">🎤 Undangan Pembicara / Kolaborasi Event</option>
                <option value="Saran & Masukan">💡 Saran & Masukan Pembangunan Syiar</option>
              </select>
            </div>

            {/* Row 3: Pesan */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Pesan / Detail Kebutuhan <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="pesan"
                rows={4}
                required
                suppressHydrationWarning
                placeholder={
                  activeTab === "wa"
                    ? "Tuliskan rincian acara, tanggal, dan bentuk permohonan kerjasama..."
                    : "Tuliskan pesan atau isi surat permohonan Anda..."
                }
                value={formData.pesan}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 text-gray-900 dark:text-white focus:border-forest-600 dark:focus:border-lime focus:ring-2 focus:ring-forest-600/20 dark:focus:ring-lime/20 text-sm font-medium outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              {activeTab === "wa" && (
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim via WhatsApp ({contactData.phone})</span>
                  <Send className="w-4 h-4 ml-1" />
                </button>
              )}

              {activeTab === "email" && (
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-forest-600 hover:bg-forest-800 dark:bg-forest-700 dark:hover:bg-forest-600 text-white font-bold text-sm shadow-lg shadow-forest-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                  <span>Kirim Email Resmi ({contactData.email})</span>
                  <Send className="w-4 h-4 ml-1" />
                </button>
              )}

              {activeTab === "ig" && (
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <AtSign className="w-4 h-4" />
                  <span>Salin Pesan & Buka DM Instagram (@jnukmiuns)</span>
                  <Send className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Address & Map Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-md p-6 sm:p-8 flex flex-col gap-6 transition-colors duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 dark:bg-forest-950/80 text-forest-700 dark:text-lime flex items-center justify-center shadow-inner shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-extrabold text-gray-900 dark:text-white text-base">Alamat Sekretariat</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                {contactData.address}
              </p>
            </div>
          </div>

          {/* Google Maps Iframe */}
          <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-gray-150/60 dark:border-gray-800 shadow-inner">
            <iframe
              src={contactData.map_embed_url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Lokasi Sekretariat JN UKMI UNS"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
