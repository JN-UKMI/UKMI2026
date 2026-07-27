"use client";

import { useState } from "react";
import { DoaCard } from "./DoaCard";
import { Sun, Moon, BookOpen, Layers, Eye, EyeOff } from "lucide-react";

type RawDoaItem = {
  id: number;
  title?: string;
  arabic: string;
  latin: string;
  translation_id: string;
  repeat?: number;
};

type Section = {
  version: string;
  time: "morning" | "evening";
  items: RawDoaItem[];
};

type MatsuratData = {
  collection: string;
  sections: Section[];
};

type DoaTabsProps = {
  sughra: MatsuratData;
  kubra: MatsuratData;
};

export function DoaTabs({ sughra, kubra }: DoaTabsProps) {
  // State terpusat untuk Versi (Sughra/Kubra), Waktu (Pagi/Sore), Latin, dan Terjemahan
  const [version, setVersion] = useState<"sughra" | "kubra">("sughra");
  const [time, setTime] = useState<"morning" | "evening">("morning");
  const [showGlobalLatin, setShowGlobalLatin] = useState(true);
  const [showGlobalTranslation, setShowGlobalTranslation] = useState(true);

  // Mendapatkan data aktif berdasarkan pilihan user
  const activeCollection = version === "sughra" ? sughra : kubra;
  const activeSection = activeCollection.sections.find((s) => s.time === time);
  const activeItems = activeSection ? activeSection.items : [];

  return (
    <div className="max-w-5xl mx-auto px-4 pb-16 w-full flex flex-col gap-6">
      {/* Control Panel Toolbar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-md border border-gray-100 dark:border-gray-800 -mt-10 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 transition-colors">
        {/* Selector 1: Versi (Sughra vs Kubra) */}
        <div className="flex flex-col gap-1.5 w-full lg:flex-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider px-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-forest-600 dark:text-lime" />
            Pilih Versi
          </span>
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex w-full">
            <button
              onClick={() => setVersion("sughra")}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap text-center ${
                version === "sughra"
                  ? "bg-forest-600 dark:bg-forest-700 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              }`}
            >
              Sughra (Ringkas)
            </button>
            <button
              onClick={() => setVersion("kubra")}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap text-center ${
                version === "kubra"
                  ? "bg-forest-600 dark:bg-forest-700 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              }`}
            >
              Kubra (Lengkap)
            </button>
          </div>
        </div>

        {/* Divider garis halus */}
        <div className="hidden lg:block h-10 w-px bg-gray-200/60 dark:bg-gray-800" />

        {/* Selector 2: Waktu (Pagi vs Sore) */}
        <div className="flex flex-col gap-1.5 w-full lg:flex-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider px-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-forest-600 dark:text-lime" />
            Waktu Dzikir
          </span>
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex w-full">
            <button
              onClick={() => setTime("morning")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                time === "morning"
                  ? "bg-forest-600 dark:bg-forest-700 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              }`}
            >
              <Sun className={`w-3.5 h-3.5 ${time === "morning" ? "animate-spin-slow" : ""}`} />
              Pagi
            </button>
            <button
              onClick={() => setTime("evening")}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                time === "evening"
                  ? "bg-forest-600 dark:bg-forest-700 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Sore
            </button>
          </div>
        </div>

        {/* Divider garis halus */}
        <div className="hidden lg:block h-10 w-px bg-gray-200/60 dark:bg-gray-800" />

        {/* Selector 3: Tampilan Terpisah Latin & Terjemahan */}
        <div className="flex flex-col gap-1.5 w-full lg:w-auto">
          <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider px-1 flex items-center gap-1">
            <Eye className="w-3 h-3 text-forest-600 dark:text-lime" />
            Pengaturan Teks
          </span>
          <div className="flex gap-2">
            {/* Toggle Latin */}
            <button
              onClick={() => setShowGlobalLatin(!showGlobalLatin)}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                showGlobalLatin
                  ? "bg-forest-600 dark:bg-forest-700 text-white border-forest-600 dark:border-forest-700 hover:bg-forest-750"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-850 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              }`}
            >
              {showGlobalLatin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              Latin
            </button>

            {/* Toggle Terjemahan */}
            <button
              onClick={() => setShowGlobalTranslation(!showGlobalTranslation)}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                showGlobalTranslation
                  ? "bg-forest-600 dark:bg-forest-700 text-white border-forest-600 dark:border-forest-700 hover:bg-forest-750"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-850 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              }`}
            >
              {showGlobalTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              Terjemah
            </button>
          </div>
        </div>
      </div>

      {/* Info Status Bacaan Aktif */}          <div className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide mt-2">
        Membaca <span className="font-bold text-forest-600 dark:text-lime">Al-Ma'surat {version === "sughra" ? "Sughra" : "Kubra"}</span> untuk waktu <span className="font-bold text-forest-600 dark:text-lime">{time === "morning" ? "Pagi" : "Sore/Petang"}</span>
      </div>

      {/* List of Doa Cards */}
      <div className="space-y-5 w-full">
        {activeItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-gray-400 dark:text-gray-500 text-sm">Belum ada dzikir untuk kategori ini.</p>
          </div>
        ) : (
          activeItems.map((doa, idx) => (
            <DoaCard
              key={`${version}-${time}-${doa.id}`}
              index={idx + 1}
              title={doa.title}
              arabic={doa.arabic}
              latin={doa.latin}
              terjemahan={doa.translation_id}
              repeat={doa.repeat}
              showLatin={showGlobalLatin}
              showTranslation={showGlobalTranslation}
            />
          ))
        )}
      </div>
    </div>
  );
}
