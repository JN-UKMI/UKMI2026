"use client";

import { useState } from "react";
import Image from "next/image";
import { AtSign, Images, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { FadeIn } from "@/components/ui/motion";
import type { MediaSpaceItem } from "@/lib/types";

interface MediaSpaceSectionProps {
  items: MediaSpaceItem[];
}

/**
 * Mosaic 6 — 2 sel besar diagonal (kiri-atas & kanan-bawah) + 4 sel kecil,
 * tanpa lubang di grid 4 kolom × 3 baris.
 *
 * Urutan DOM diatur (bukan index items) agar auto-placement CSS menghasilkan
 * layout diagonal: items[0] besar di kiri-atas, items[1] besar di kanan-bawah.
 *
 * Di mobile (grid 2 kolom): sel besar full-width di atas & bawah, 4 kecil di tengah.
 */
const SLOTS = [
  { itemIndex: 0, className: "col-span-2 row-span-2" },
  { itemIndex: 2, className: "" },
  { itemIndex: 3, className: "" },
  { itemIndex: 4, className: "" },
  { itemIndex: 5, className: "" },
  {
    itemIndex: 1,
    className: "col-span-2 row-span-2 md:col-start-3 md:row-start-2",
  },
];

function MediaSpaceCell({
  item,
  isLarge,
  isMobileActive,
  onMobileToggle,
  className = "",
}: {
  item: MediaSpaceItem;
  isLarge: boolean;
  isMobileActive: boolean;
  onMobileToggle: (id: string) => boolean;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = item.imageUrl && !imageFailed;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth < 768) {
      const wasActive = onMobileToggle(item.id);
      if (!wasActive) {
        e.preventDefault();
      }
    }
  };

  return (
    <a
      href={item.instagramUrl || "https://www.instagram.com/jnukmiuns/"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Buka ${item.title} di Instagram`}
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-forest-600 dark:border-lime bg-gray-100 dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 motion-safe:hover:scale-[1.01] focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-lime dark:focus-visible:outline-lime ${className}`}
    >
      {showImage ? (
        <Image
          src={item.imageUrl}
          alt={`Dokumentasi ${item.title} — JN UKMI UNS Solo`}
          fill
          sizes={
            isLarge
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 50vw, 25vw"
          }
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-forest-600/90 via-forest-800/90 to-gray-900 flex items-center justify-center">
          <span className="text-white/90 font-black uppercase tracking-widest text-xs sm:text-sm text-center px-4 line-clamp-3">
            {item.title}
          </span>
        </div>
      )}

      {/* Overlay gradient — tersembunyi secara default di mobile, muncul saat isMobileActive atau hover di desktop */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${
          isMobileActive
            ? "opacity-100"
            : "opacity-0 md:group-hover:opacity-100"
        }`}
      />

      {/* Konten overlay — judul & deskripsi */}
      <div
        className={`absolute inset-x-0 bottom-0 p-3 sm:p-5 transition-all duration-300 ${
          isMobileActive
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0"
        }`}
      >
        <div className="flex items-center gap-1.5 mb-1 text-[10px] sm:text-xs font-bold text-lime uppercase tracking-wider">
          <AtSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>{isLarge ? "Konten Unggulan" : "Instagram"}</span>
        </div>
        <h3
          className={`font-black text-white leading-tight ${
            isLarge ? "text-sm sm:text-xl" : "text-xs sm:text-sm"
          }`}
        >
          {item.title}
        </h3>
        <p
          className={`text-white/80 leading-snug ${
            isLarge ? "text-[11px] sm:text-sm" : "text-[10px] sm:text-xs"
          } line-clamp-2 mt-0.5 sm:mt-1`}
        >
          {item.description}
        </p>
        <span className="inline-flex items-center gap-1 mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-bold text-lime group-hover:text-lime transition-colors">
          <span className="md:hidden font-semibold text-white/90">Klik lagi untuk buka</span>
          <span className="hidden md:inline">Buka di Instagram</span>
          <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </span>
      </div>
    </a>
  );
}

export function MediaSpaceSection({ items }: MediaSpaceSectionProps) {
  const [activeMobileId, setActiveMobileId] = useState<string | null>(null);

  if (!items || items.length === 0) return null;

  const handleMobileToggle = (id: string) => {
    if (activeMobileId === id) {
      return true;
    }
    setActiveMobileId(id);
    return false;
  };

  // Bento menampilkan maksimal 6 item (sesuai layout Mosaic 6)
  const visible = items.slice(0, 6);
  const fullMosaic = visible.length >= 6;
  const slots = SLOTS.filter((s) => s.itemIndex < visible.length).map((slot) => ({
    ...slot,
    // Dengan item < 6, lepas posisi diagonal eksplisit (col-start-3/row-start-2)
    // agar auto-placement CSS mengisi grid tanpa lubang.
    className:
      slot.itemIndex === 1 && !fullMosaic
        ? "col-span-2 row-span-2"
        : slot.className,
  }));

  return (
    <section className="py-8 sm:py-14 px-3 sm:px-6 bg-transparent transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-6 sm:mb-10 text-center">
          <SectionHeader
            icon={
              <Images className="w-5 h-5 sm:w-6 sm:h-6 text-forest-600 dark:text-lime" />
            }
            title="Media Space"
            subtitle="Dokumentasi kegiatan & momen dakwah JN UKMI"
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[130px] sm:auto-rows-[180px] lg:auto-rows-[200px]">
            {slots.map((slot) => {
              const item = visible[slot.itemIndex];
              if (!item) return null;
              const isLarge = slot.itemIndex === 0 || slot.itemIndex === 1;
              return (
                <MediaSpaceCell
                  key={item.id}
                  item={item}
                  isLarge={isLarge}
                  isMobileActive={activeMobileId === item.id}
                  onMobileToggle={handleMobileToggle}
                  className={slot.className}
                />
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
