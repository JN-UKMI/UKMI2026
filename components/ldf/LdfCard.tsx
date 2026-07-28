"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { LDF } from "@/lib/types";
import { useIsTouchDevice } from "@/lib/hooks";

export interface LdfCardProps {
  ldf: LDF;
}

export function LdfCard({ ldf }: LdfCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const isTouchDevice = useIsTouchDevice();
  const rawUrl = ldf.instagram_url || ldf.instagram || "#";
  const igUrl = rawUrl.startsWith("http") ? rawUrl : rawUrl !== "#" ? `https://www.instagram.com/${rawUrl.replace(/^@/, "")}/` : "#";

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className="group h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-4 hover:border-lime transition-all duration-300 overflow-hidden"
    >
      {/* ── Mobile: Horizontal layout (image left, text right) ── */}
      {/* ── sm+: Vertical layout (image top, text bottom) ── */}
      <div className="flex flex-row sm:flex-col h-full">
        {/* 1. Gambar */}
        <div className="relative w-28 h-28 sm:w-full sm:aspect-[16/10] shrink-0 overflow-hidden bg-white dark:bg-gray-900 sm:bg-gray-100 sm:dark:bg-gray-800">
          <Image
            src={ldf.gambar || "/placeholder.png"}
            alt={ldf.nama}
            fill
            sizes="(max-width: 640px) 112px, (max-width: 1024px) 33vw, 288px"
            loading="lazy"
            className="object-contain sm:object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Container */}
        <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            {/* 2. Nama */}
            <h3 className="text-sm sm:text-lg font-bold text-forest-900 dark:text-lime leading-snug group-hover:text-forest-600 dark:group-hover:text-lime transition-colors line-clamp-2 sm:line-clamp-none">
              {ldf.nama}
            </h3>

            {/* 3. Deskripsi Singkat */}
            <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 sm:line-clamp-3 font-medium">
              {ldf.deskripsi}
            </p>
          </div>

          {/* 4. Tombol Menuju Instagram */}
          <div className="pt-1.5 sm:pt-4 mt-auto">
            <motion.a
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Kunjungi Instagram ${ldf.nama}`}
              className="flex items-center justify-center gap-1 sm:gap-2 w-full py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-[11px] sm:text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
            >
              <span className="hidden sm:inline">Kunjungi Instagram</span>
              <span className="sm:hidden">Instagram</span>
              <motion.span
                animate={shouldReduceMotion || isTouchDevice ? undefined : { x: [0, 3, 0] }}
                transition={shouldReduceMotion || isTouchDevice ? undefined : { repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
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
