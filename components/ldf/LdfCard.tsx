"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { LDF } from "@/lib/types";

export interface LdfCardProps {
  ldf: LDF;
}

export function LdfCard({ ldf }: LdfCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const rawUrl = ldf.instagram_url || ldf.instagram || "#";
  const hasInstagramUrl = rawUrl !== "#" && rawUrl.trim() !== "";
  const igUrl = rawUrl.startsWith("http") ? rawUrl : hasInstagramUrl ? `https://www.instagram.com/${rawUrl.replace(/^@/, "")}/` : "#";

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className="group h-full bg-white dark:bg-gray-900 rounded-2xl border-2 border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
    >
      {/* ── Mobile: Horizontal layout (image left, text right) ── */}
      {/* ── sm+: Vertical layout (image top, text bottom) ── */}
      <div className="flex flex-row sm:flex-col h-full">
        {/* 1. Gambar (Full fit container on mobile & desktop) */}
        <div className="relative w-28 sm:w-full self-stretch sm:aspect-[16/10] shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={ldf.gambar || "/placeholder.png"}
            alt={ldf.nama}
            fill
            sizes="(max-width: 640px) 112px, (max-width: 1024px) 33vw, 288px"
            loading="lazy"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Container */}
        <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            {/* 2. Nama */}
            <h3 className="card-title-underline text-sm sm:text-lg font-bold text-forest-900 dark:text-lime leading-[1.75] group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">
              {ldf.nama}
            </h3>

            {/* 3. Deskripsi Singkat */}
            <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 sm:line-clamp-3 font-medium">
              {ldf.deskripsi}
            </p>
          </div>

          {/* 4. Tombol Menuju Instagram */}
          {hasInstagramUrl && (
            <div className="pt-1.5 sm:pt-4 mt-auto">
            <motion.a
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Kunjungi Instagram ${ldf.nama}`}
              className="group/instagram relative isolate flex w-full items-center justify-center gap-1 sm:gap-2 overflow-hidden rounded-xl border border-pink-500 dark:border-pink-400 bg-transparent text-white px-2 py-2 sm:px-4 sm:py-2.5 text-[11px] sm:text-xs font-bold shadow-sm transition-colors duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 motion-reduce:transform-none motion-reduce:transition-none sm:text-pink-600 dark:sm:text-pink-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 translate-x-0 bg-gradient-to-r from-purple-700 via-pink-700 to-orange-600 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out sm:-translate-x-full sm:motion-safe:group-hover/instagram:translate-x-0 motion-reduce:transition-none"
              />
              <span className="relative z-10 inline-flex items-center justify-center gap-1 sm:gap-2 text-white transition-colors duration-300 motion-reduce:transition-none sm:text-pink-600 dark:sm:text-pink-300 sm:group-hover/instagram:text-white">
                <span className="hidden sm:inline">Kunjungi Instagram</span>
                <span className="sm:hidden">Instagram</span>
                <span className="text-xs sm:text-sm transition-transform duration-300 motion-safe:group-hover/instagram:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none">
                  ↗
                </span>
              </span>
            </motion.a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
