"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Layers, ShieldCheck, Flower2, Leaf } from "lucide-react";

export interface FilosofiItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
}

interface LogoKabinetSectionProps {
  filosofi?: string;
  items?: FilosofiItem[];
}

const DEFAULT_ITEMS: FilosofiItem[] = [
  {
    id: "full",
    title: "Logo Utama Kabinet",
    subtitle: "Kesatuan & Visioner",
    image: "/image/kabinet-full-1.webp",
    description:
      "Simbol kepemimpinan Islam yang visioner, tangguh, dan berani seperti Sultan Iskandar Muda, memadukan seluruh elemen ukhuwah dan perjuangan dakwah JN UKMI UNS.",
  },
  {
    id: "kelopak",
    title: "Kelopak Bunga Melati",
    subtitle: "Kesucian Akhlak & Keharuman Syiar",
    image: "/image/kabinet-kelopak-2.webp",
    description:
      "Melambangkan kesucian niat, kerendahan hati, dan keharuman akhlak para Aktivis Dakwah Kampus dalam menebarkan kebaikan di Universitas Sebelas Maret.",
  },
  {
    id: "lingkaran",
    title: "Lingkaran Benteng Ukhuwah",
    subtitle: "Barisan Kokoh & Pelindung",
    image: "/image/kabinet-lingkaran-3.webp",
    description:
      "Melambangkan persatuan barisan yang kokoh (QS. Ash-Shaff: 4), menjaga keharmonisan lembaga, serta membentengi nilai-nilai keislaman dari pengaruh luar.",
  },
  {
    id: "daun",
    title: "Daun & Perisai Pertumbuhan",
    subtitle: "Kaderisasi & Gagasan Segar",
    image: "/image/kabinet-daun-4.webp",
    description:
      "Melambangkan proses kaderisasi yang terus tumbuh berkembang, ide-ide segar dalam syiar, serta perisai dakwah yang memberikan manfaat bagi civitas akademika.",
  },
];

const ICONS = [Layers, Flower2, ShieldCheck, Leaf];

export function LogoKabinetSection({ items = DEFAULT_ITEMS }: LogoKabinetSectionProps) {
  const [activeId, setActiveId] = useState<string>("full");
  const activeItem = items.find((item) => item.id === activeId) || items[0];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-50 dark:bg-forest-950/60 text-forest-700 dark:text-lime border border-forest-200/80 dark:border-forest-800 rounded-full text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
          Filosofi Logo Kabinet
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-forest-900 dark:text-white tracking-tight">
          Makna Elemen Logo Iskandar Muda
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          Setiap lengkungan dan elemen logo menyimpan makna mendalam dalam merefleksikan nilai, budaya, serta semangat perjuangan dakwah JN UKMI UNS 2026.
        </p>
      </div>

      {/* Main Feature Highlight Display */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col md:flex-row items-center gap-8 md:gap-12 transition-all">
        {/* Active Logo Image Box */}
        <div className="relative shrink-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800/60 p-6 rounded-[10px] border border-gray-100 dark:border-gray-750 group overflow-hidden w-full md:w-80 h-72">
          <div className="absolute inset-0 bg-forest-600/5 dark:bg-lime/5 rounded-[10px] blur-xl group-hover:bg-forest-600/10 dark:group-hover:bg-lime/10 transition-colors pointer-events-none" />
          <Image
            key={activeItem.image}
            src={activeItem.image}
            alt={activeItem.title}
            width={340}
            height={340}
            className="w-56 sm:w-64 h-56 sm:h-64 object-contain rounded-[10px] drop-shadow-md transition-all duration-300 transform group-hover:scale-105"
            priority
          />
        </div>

        {/* Active Logo Info */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-block px-2.5 py-0.5 rounded-md bg-forest-100 dark:bg-forest-900/60 text-forest-800 dark:text-lime text-xs font-bold uppercase tracking-wider">
            {activeItem.subtitle}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-forest-900 dark:text-white tracking-tight">
            {activeItem.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            {activeItem.description}
          </p>

          {/* Quick Tab Selectors */}
          <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
            {items.map((item, idx) => {
              const Icon = ICONS[idx % ICONS.length];
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border active:scale-95 ${
                    isActive
                      ? "bg-forest-600 dark:bg-forest-700 text-white border-forest-600 dark:border-forest-700 shadow-md"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-forest-600 dark:text-lime"}`} />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4 Cards Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => {
          const Icon = ICONS[idx % ICONS.length];
          const isActive = item.id === activeId;
          return (
            <div
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={`bg-white dark:bg-gray-900 rounded-2xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1 shadow-sm hover:shadow-lg ${
                isActive
                  ? "border-forest-600 dark:border-lime ring-2 ring-forest-600/20 dark:ring-lime/20"
                  : "border-gray-100 dark:border-gray-800 hover:border-forest-300 dark:hover:border-forest-700"
              }`}
            >
              <div className="space-y-4">
                {/* Thumbnail Image Box */}
                <div className="relative bg-gray-50 dark:bg-gray-800/60 p-4 rounded-[10px] border border-gray-100 dark:border-gray-750 flex items-center justify-center h-44 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={180}
                    height={180}
                    className="w-36 h-36 object-contain rounded-[10px] drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Card Title & Icon */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-forest-600 dark:text-lime">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.subtitle}</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">
                    {item.title}
                  </h4>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
