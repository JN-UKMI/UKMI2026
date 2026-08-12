"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Layers, ShieldCheck, Flower2, Leaf } from "lucide-react";
import { motion } from "framer-motion";

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
    title: "Warna & Filosofi Teal",
    subtitle: "Keseimbangan Karakter Organisasi",
    image: "/image/kabinet-full-1.webp",
    description:
      "Warna teal (#02ACC1) merupakan perpaduan biru dan hijau. Biru merepresentasikan ketenangan, kepercayaan, dan profesionalisme dalam menjalankan amanah dakwah, sedangkan hijau merepresentasikan kehidupan, harapan, dan semangat pertumbuhan. Kombinasi keduanya mencerminkan karakter JN UKMI sebagai organisasi dakwah yang adaptif, kolaboratif, dan berorientasi pada kebermanfaatan, tanpa meninggalkan nilai-nilai Islam sebagai pondasi perjuangan.",
  },
  {
    id: "kelopak",
    title: "Empat Kelopak",
    subtitle: "Nilai Utama Organisasi",
    image: "/image/kabinet-kelopak-2.webp",
    description:
      "Empat kelopak merepresentasikan empat nilai inti JN UKMI: Inklusif, Transformatif, Kolaboratif, dan Harmonis. Meski memiliki peran dan makna yang berbeda, keempatnya bertemu pada satu titik pusat sebagai simbol arah perjuangan yang sama. Orientasi kelopak yang mengarah ke atas mencerminkan semangat ‘irtaqa’ yaitu komitmen untuk terus bertumbuh dan meningkatkan kualitas diri, organisasi, dan dakwah, dengan tetap berorientasi pada ridha Allah Swt. serta kebermanfaatan bagi umat.",
  },
  {
    id: "lingkaran",
    title: "Dua Titik di Puncak Bunga",
    subtitle: "Ilmu dan Amal",
    image: "/image/kabinet-lingkaran-3.webp",
    description:
      "Dua titik yang berada di posisi tertinggi melambangkan ilmu dan amal sebagai dua orientasi utama pembinaan kader JN UKMI. Keduanya bukan capaian yang berdiri sendiri, melainkan satu kesatuan proses. Ilmu menjadi landasan berpikir dan bertindak, sedangkan amal menjadi bentuk konkret dari ilmu tersebut dalam pengabdian dan pelayanan kepada umat. Posisinya di puncak menegaskan bahwa seluruh proses dakwah pada akhirnya bermuara pada lahirnya kader yang berilmu, berkarakter, dan berkontribusi nyata bagi sesama.",
  },
  {
    id: "daun",
    title: "Dua Helai Daun",
    subtitle: "Al-Qur’an dan As-Sunnah",
    image: "/image/kabinet-daun-4.webp",
    description:
      "Sebagaimana daun mengalirkan hidup bagi bunga, Al-Qur'an dan As-Sunnah mengalirkan hidup bagi dakwah. Dua helai daun melambangkan Al-Qur'an dan As-Sunnah sebagai dua sumber utama ajaran Islam yang menopang seluruh proses pembinaan kader. Kedua pedoman ini menjadi dasar bagi setiap nilai, budaya, dan arah gerak organisasi, memastikan setiap langkah JN UKMI tetap berada dalam koridor syariat islam.",
  },
];

const ICONS = [Layers, Flower2, ShieldCheck, Leaf];

export function LogoKabinetSection({ items = DEFAULT_ITEMS }: LogoKabinetSectionProps) {
  const [activeId, setActiveId] = useState<string>("full");
  const activeItem = items.find((item) => item.id === activeId) || items[0];

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-50 dark:bg-forest-950/60 text-forest-700 dark:text-lime border border-forest-200/80 dark:border-forest-800 rounded-full text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
          Filosofi Logo Kabinet
        </div>
        <h2 className="section-title-hover text-2xl sm:text-4xl font-black text-forest-900 dark:text-white tracking-tight">
          Makna Elemen Logo Iskandar Muda
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          Setiap lengkungan dan elemen logo menyimpan makna mendalam dalam merefleksikan nilai, budaya, serta semangat perjuangan dakwah JN UKMI UNS 2026.
        </p>
      </div>

      {/* Main Feature Highlight Display */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-10 border-2 border-forest-600 dark:border-lime shadow-xl flex flex-col md:flex-row items-center gap-4 sm:gap-12 transition-all">
        {/* Active Logo Image Box with Ultra-Light GPU Transition */}
        <div className="relative shrink-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800/60 p-3 sm:p-6 rounded-[10px] border border-gray-100 dark:border-gray-750 group overflow-hidden w-full md:w-80 h-48 sm:h-72">
          <div className="hidden sm:block absolute inset-0 bg-forest-600/5 dark:bg-lime/5 rounded-[10px] blur-xl group-hover:bg-lime/10 dark:group-hover:bg-lime/10 transition-colors pointer-events-none" />
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0.2, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full h-full flex items-center justify-center transform-gpu"
          >
            <Image
              src={activeItem.image}
              alt={activeItem.title}
              width={340}
              height={340}
              className="w-36 sm:w-64 h-36 sm:h-64 object-contain rounded-[10px] drop-shadow-md"
              priority
            />
          </motion.div>
        </div>

        {/* Active Logo Info with Fast Instant Fade */}
        <div className="flex-1 space-y-3 sm:space-y-4 text-center md:text-left min-h-0 sm:min-h-[160px] flex flex-col justify-between">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0.2, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="space-y-1.5 sm:space-y-3 transform-gpu"
          >
            <div className="inline-block px-2 py-0.5 rounded-md bg-forest-100 dark:bg-forest-900/60 text-forest-800 dark:text-lime text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              {activeItem.subtitle}
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-forest-900 dark:text-white tracking-tight">
              {activeItem.title}
            </h3>
            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {activeItem.description}
            </p>
          </motion.div>

          {/* Quick Tab Selectors */}
          <div className="pt-1 sm:pt-2 flex flex-wrap gap-1.5 sm:gap-2 justify-center md:justify-start">
            {items.map((item, idx) => {
              const Icon = ICONS[idx % ICONS.length];
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-150 cursor-pointer border active:scale-95 ${
                    isActive
                      ? "bg-forest-600 dark:bg-forest-700 text-white border-forest-600 dark:border-forest-700 shadow-md"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
                  }`}
                >
                  <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? "text-white" : "text-forest-600 dark:text-lime"}`} />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile View: Horizontal Touch Carousel */}
      <div className="sm:hidden space-y-3">
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3 px-1 py-1 -mx-4 px-4">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <div
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={`w-[44vw] max-w-[160px] aspect-square shrink-0 snap-center bg-white dark:bg-gray-900 rounded-xl p-2.5 border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between text-center gap-1.5 group shadow-sm active:scale-98 ${
                  isActive
                    ? "border-lime dark:border-lime ring-2 ring-forest-600/20 dark:ring-lime/20"
                    : "border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime"
                }`}
              >
                {/* Thumbnail Image Box */}
                <div className="relative bg-gray-50 dark:bg-gray-800/60 p-2 rounded-[8px] border border-gray-100 dark:border-gray-750 flex items-center justify-center w-full flex-1 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={140}
                    height={140}
                    className="w-20 h-20 object-contain rounded-[8px] drop-shadow-sm"
                  />
                </div>

                {/* Card Title Only */}
                <h4 className="text-[11px] font-bold text-gray-900 dark:text-white line-clamp-1 px-0.5">
                  {item.title}
                </h4>
              </div>
            );
          })}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex justify-center items-center gap-2 pt-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className="p-2 flex items-center justify-center min-w-[36px] min-h-[36px] cursor-pointer"
              aria-label={`Pilih elemen ${item.title}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  item.id === activeId
                    ? "w-7 h-2 bg-forest-600 dark:bg-lime"
                    : "w-2 h-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Desktop View: 4 Cards Grid (Square Aspect Ratio) */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <div
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={`aspect-square bg-white dark:bg-gray-900 rounded-2xl p-5 border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between text-center gap-3 group hover:-translate-y-1 shadow-sm hover:shadow-lg ${
                isActive
                  ? "border-lime dark:border-lime ring-2 ring-forest-600/20 dark:ring-lime/20"
                  : "border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime"
              }`}
            >
              {/* Thumbnail Image Box */}
              <div className="relative bg-gray-50 dark:bg-gray-800/60 p-4 rounded-[10px] border border-gray-100 dark:border-gray-750 flex items-center justify-center w-full flex-1 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={180}
                  height={180}
                  className="w-32 h-32 md:w-36 md:h-36 object-contain rounded-[10px] drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Card Title Only */}
              <h4 className="card-title-underline text-sm font-bold text-gray-900 dark:text-white group-hover:text-forest-600 dark:group-hover:text-lime transition-colors leading-[1.75] px-1 pt-1">
                {item.title}
              </h4>
            </div>
          );
        })}
      </div>
    </section>
  );
}
