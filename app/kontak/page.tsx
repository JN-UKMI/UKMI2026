import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import contactData from "@/content/kontak/main.json";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Hubungi Kami | JN UKMI",
  description: "Hubungi JN UKMI UNS melalui email atau WhatsApp",
};

export default function KontakPage() {
  // Clean phone number for WhatsApp link
  // e.g. "+62 823 2851 2139" -> "6282328512139"
  const waPhone = contactData.phone.replace(/[^0-9]/g, "");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PageHero 
        badge="Hubungi Pengurus"
        title="Hubungi Kami" 
        subtitle="Kami siap melayani pertanyaan, saran, dan koordinasi syiar dakwah" 
      />

      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col gap-12 animate-[fadeIn_0.5s_ease-out]">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: WhatsApp */}
          <div className="bg-white rounded-3xl border border-gray-200/60 shadow-md p-8 flex flex-col items-center text-center gap-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xl font-extrabold text-gray-900">Kirim Pesan WhatsApp</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Layanan koordinasi cepat melalui WhatsApp</p>
            </div>
            <span className="text-base font-extrabold text-gray-900 font-mono">
              {contactData.phone}
            </span>
            <a
              href={`https://wa.me/${waPhone}?text=Assalamualaikum%20JN%20UKMI%20UNS...`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-colors text-center cursor-pointer"
            >
              Kirim Pesan WA
            </a>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white rounded-3xl border border-gray-200/60 shadow-md p-8 flex flex-col items-center text-center gap-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 rounded-2xl bg-forest-50 text-forest-600 flex items-center justify-center shadow-inner">
              <Mail className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xl font-extrabold text-gray-900">Email Resmi</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Kirim surat resmi atau proposal kerjasama</p>
            </div>
            <span className="text-base font-extrabold text-gray-900 font-mono">
              {contactData.email}
            </span>
            <a
              href={`mailto:${contactData.email}`}
              className="w-full py-3 px-6 rounded-2xl bg-forest-600 hover:bg-forest-800 text-white font-bold text-sm shadow-sm transition-colors text-center cursor-pointer"
            >
              Kirim Email
            </a>
          </div>
        </div>

        {/* Address and Map Card */}
        <div className="bg-white rounded-3xl border border-gray-200/60 shadow-md p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-55 text-gray-600 flex items-center justify-center shadow-inner shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-extrabold text-gray-900 text-base">Alamat Sekretariat</h4>
              <p className="text-sm text-gray-600 leading-relaxed font-semibold">
                {contactData.address}
              </p>
            </div>
          </div>

          {/* Google Maps Iframe */}
          <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-gray-150/60 shadow-inner">
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
