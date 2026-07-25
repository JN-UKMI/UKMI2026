"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { LDF } from "@/lib/types";

export interface LdfCardProps {
  ldf: LDF;
}

export function LdfCard({ ldf }: LdfCardProps) {
  const rawUrl = ldf.instagram_url || ldf.instagram || "#";
  const igUrl = rawUrl.startsWith("http") ? rawUrl : rawUrl !== "#" ? `https://www.instagram.com/${rawUrl.replace(/^@/, "")}/` : "#";

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className="group h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-forest-600/30 dark:hover:border-lime/30 transition-colors overflow-hidden flex flex-col justify-between"
    >
      <div className="flex flex-col flex-1 items-stretch justify-between">
        {/* 1. Gambar */}
        <div className="relative w-full aspect-[16/10] shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={ldf.gambar || "/placeholder.png"}
            alt={ldf.nama}
            fill
            sizes="(max-width: 640px) 112px, (max-width: 1024px) 33vw, 288px"
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-108"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3 sm:gap-0">
          <div>
            {/* 2. Nama LDF */}
            <h3 className="text-sm sm:text-lg font-bold text-forest-900 dark:text-lime leading-snug group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">
              {ldf.nama}
            </h3>

            {/* 3. Deskripsi Singkat */}
            <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 sm:line-clamp-3 font-medium">
              {ldf.deskripsi}
            </p>
          </div>

          {/* 4. Tombol Menuju Instagram */}
          <div className="pt-1 sm:pt-4 sm:mt-auto">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Kunjungi Instagram ${ldf.nama}`}
              className="flex items-center justify-center gap-1.5 sm:gap-2 w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-[11px] sm:text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>Kunjungi Instagram</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="text-xs sm:text-sm"
              >
                ↗
              </motion.span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
