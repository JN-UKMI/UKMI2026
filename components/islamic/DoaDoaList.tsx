"use client";

import { useState } from "react";
import { Search, Copy, Check, BookOpen, Sparkles, Eye, EyeOff } from "lucide-react";
import type { DoaItem } from "@/lib/types";

interface DoaDoaListProps {
  initialList: DoaItem[];
}

export function DoaDoaList({ initialList }: DoaDoaListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showLatin, setShowLatin] = useState(true);
  const [showTerjemahan, setShowTerjemahan] = useState(true);

  const filteredList = initialList.filter(
    (item) =>
      (item.judul || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.kategori || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.terjemahan || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.latin || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Controls Bar: Search & Visibility Toggles */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-gray-200 shadow-sm">
        {/* Search Input Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari doa (misal: Pembuka Majelis, Belajar)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 transition-all"
          />
        </div>

        {/* Toggle Buttons (Hide/Show Latin & Terjemahan) */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowLatin(!showLatin)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
              showLatin
                ? "bg-forest-600/10 text-forest-700 border-forest-600/20"
                : "bg-gray-100 text-gray-400 border-gray-200 line-through"
            }`}
          >
            {showLatin ? <Eye className="w-3.5 h-3.5 text-forest-600" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Latin</span>
          </button>

          <button
            onClick={() => setShowTerjemahan(!showTerjemahan)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
              showTerjemahan
                ? "bg-forest-600/10 text-forest-700 border-forest-600/20"
                : "bg-gray-100 text-gray-400 border-gray-200 line-through"
            }`}
          >
            {showTerjemahan ? <Eye className="w-3.5 h-3.5 text-forest-600" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Terjemahan</span>
          </button>
        </div>
      </div>

      {/* Doa Cards Grid */}
      <div className="flex flex-col gap-6">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-350 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold text-sm">Doa yang Anda cari tidak ditemukan.</p>
          </div>
        ) : (
          filteredList.map((item, idx) => {
            const itemId = item.id || `doa-${idx}`;
            let copyText = `${item.judul || "Doa"}\n\n${item.arabic}`;
            if (showLatin) copyText += `\n\nLatin:\n${item.latin}`;
            if (showTerjemahan) copyText += `\n\nArtinya:\n"${item.terjemahan}"`;
            
            const isCopied = copiedId === itemId;

            return (
              <div
                key={itemId}
                className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-l-4 border-l-forest-600 border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col gap-4 relative"
              >
                {/* Card Header: Category & Title & Copy Button */}
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex flex-col gap-1.5">
                    {item.kategori && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-600/10 text-forest-700 rounded-full text-xs font-bold w-max">
                        <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                        {item.kategori}
                      </span>
                    )}
                    <h3 className="text-lg sm:text-xl font-black text-forest-900 leading-snug">
                      {item.judul || `Doa #${idx + 1}`}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleCopy(itemId, copyText)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-forest-50 text-gray-600 hover:text-forest-700 border border-gray-200 hover:border-forest-200 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95"
                    title="Salin Doa Lengkap"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-forest-600" />
                        <span className="text-forest-600">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Doa</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Fadhilah / Keutamaan */}
                {item.fadhilah && (
                  <div className="bg-forest-50/70 border border-forest-100 rounded-xl p-3 text-xs text-forest-900 leading-relaxed font-medium">
                    <strong className="text-forest-700">Keutamaan & Penggunaan:</strong> {item.fadhilah}
                  </div>
                )}

                {/* Arabic Text (RTL Large) */}
                <div className="py-5 px-4 sm:px-6 bg-gray-50/80 rounded-2xl border border-gray-100 text-right">
                  <p
                    className="font-arabic text-2xl sm:text-3xl leading-[2.2] text-gray-900 select-all"
                    dir="rtl"
                  >
                    {item.arabic}
                  </p>
                </div>

                {/* Latin Transliteration (Conditional) */}
                {showLatin && (
                  <div className="text-sm font-semibold text-forest-800 leading-relaxed italic bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/60 transition-all animate-fadeIn">
                    “{item.latin}”
                  </div>
                )}

                {/* Indonesian Translation (Conditional) */}
                {showTerjemahan && (
                  <div className="text-xs sm:text-sm text-gray-600 leading-relaxed transition-all animate-fadeIn">
                    <strong className="text-gray-900 font-bold block mb-1">Artinya:</strong>
                    “{item.terjemahan}”
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
