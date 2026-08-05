"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight, MapPin, Calendar, X, ZoomIn } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { KegiatanSeruItem } from "@/lib/types";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

interface KegiatanSeruSectionProps {
  initialEvents?: KegiatanSeruItem[];
}

export function KegiatanSeruSection({ initialEvents = [] }: KegiatanSeruSectionProps) {
  const events = initialEvents;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [lightbox, setLightbox] = useState<KegiatanSeruItem | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Kunci scroll body & tutup lightbox dengan tombol Escape saat terbuka
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  // Responsive visible card counts (2 on desktop lg, 1 on mobile/tablet)
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  if (!events || events.length === 0) return null;

  const maxIndex = Math.max(0, events.length - visibleCards);

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <>
    <section className="py-12 sm:py-20 px-3 sm:px-6 bg-transparent transition-colors duration-300 relative overflow-hidden">

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <FadeIn className="relative mb-6 sm:mb-10 text-center">
          <SectionHeader
            icon={<Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-forest-600 dark:text-lime" />}
            title="Event Terdekat"
            subtitle="Berbagai agenda & kegiatan seru yang bikin kamu makin berkembang!"
          />

          {/* Carousel Controls Header Buttons */}
          {events.length > visibleCards && (
            <div className="flex items-center justify-center sm:justify-end gap-2 mt-4 sm:mt-0 sm:absolute sm:top-2 sm:right-0">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                aria-label="Kegiatan sebelumnya"
                className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border backdrop-blur-md transition-all duration-300 cursor-pointer ${
                  currentIndex === 0
                    ? "border-gray-200 text-gray-300 dark:border-gray-800 dark:text-gray-700 cursor-not-allowed opacity-40"
                    : "border-forest-600/20 text-forest-800 bg-white/80 hover:bg-forest-600 hover:text-white dark:border-lime/30 dark:text-lime dark:bg-gray-900/80 dark:hover:bg-lime dark:hover:text-forest-950 shadow-md hover:shadow-lg active:scale-95"
                }`}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                aria-label="Kegiatan berikutnya"
                className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border backdrop-blur-md transition-all duration-300 cursor-pointer ${
                  currentIndex >= maxIndex
                    ? "border-gray-200 text-gray-300 dark:border-gray-800 dark:text-gray-700 cursor-not-allowed opacity-40"
                    : "border-forest-600/20 text-forest-800 bg-white/80 hover:bg-forest-600 hover:text-white dark:border-lime/30 dark:text-lime dark:bg-gray-900/80 dark:hover:bg-lime dark:hover:text-forest-950 shadow-md hover:shadow-lg active:scale-95"
                }`}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </FadeIn>

        {/* Carousel Container Wrapper */}
        <div className="overflow-hidden p-1 -m-1">
          <StaggerContainer className="overflow-visible">
            <div
              className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6 py-2 sm:py-4"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              }}
            >
              {events.map((item) => (
                <StaggerItem
                  key={item.id}
                  className="w-full lg:w-[calc(50%-12px)] shrink-0 flex"
                >
                  {/* Event Card Component - Always Horizontal Layout (Poster Left, Info Right) */}
                  <div
                    onClick={() => setLightbox(item)}
                    onKeyDown={(e) => {
                      // Hanya tangani saat fokus ada di card itu sendiri (bukan link anak)
                      if (e.target !== e.currentTarget) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setLightbox(item);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-label={`Lihat poster ${item.title}`}
                    className="relative bg-white dark:bg-gray-900/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 border-gray-200/90 dark:border-gray-800 shadow-md hover:shadow-xl hover:border-emerald-500 dark:hover:border-lime dark:hover:shadow-[0_0_30px_rgba(73,154,19,0.25)] transition-all duration-300 group flex flex-row w-full overflow-hidden hover:-translate-y-1 z-10 hover:z-30 cursor-pointer select-none"
                  >
                    
                    {/* Left Column: Poster Container (Always Horizontal side by side) */}
                    <div className="relative w-[125px] min-[400px]:w-[145px] sm:w-5/12 self-stretch min-h-full shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800/90">
                      <Image
                        src={item.posterUrl || "/placeholder.png"}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 150px, 400px"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-108"
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-black/30 opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Affordance: klik untuk memperbesar poster */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-[10px] sm:text-xs font-bold shadow-lg">
                          <ZoomIn className="w-3.5 h-3.5" />
                          Perbesar
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Information & Details */}
                    <div className="p-3.5 sm:p-7 flex flex-col justify-between flex-1 gap-2.5 sm:gap-5 min-w-0">
                      <div className="space-y-2 sm:space-y-3.5">
                        {/* Event Title */}
                        <h3 className="text-sm sm:text-xl font-black text-gray-900 dark:text-white leading-tight sm:leading-snug group-hover:text-forest-600 dark:group-hover:text-lime transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        {/* Date & Location Badges */}
                        <div className="space-y-1 sm:space-y-2">
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-forest-50 dark:bg-forest-950/60 text-forest-700 dark:text-lime text-[11px] sm:text-xs font-bold border border-forest-100 dark:border-forest-800/60 max-w-full">
                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-forest-600 dark:text-lime" />
                            <span className="truncate">{item.date}</span>
                          </div>

                          {item.location && (
                            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-gray-600 dark:text-gray-300">
                              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-forest-600 dark:text-sage" />
                              <span className="truncate">{item.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-300 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-3 font-normal">
                          {item.description}
                        </p>
                      </div>

                      {/* Action Button: Lihat Detail (Solid color, no gradient) */}
                      <div className="pt-1.5 sm:pt-2 border-t border-gray-100 dark:border-gray-800/80">
                        <a
                          href={item.instagramUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-forest-600 hover:bg-forest-700 dark:bg-lime dark:hover:bg-lime-400 dark:text-forest-950 text-white text-[11px] sm:text-sm font-bold sm:font-black transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] group/btn"
                        >
                          <span>Lihat Detail</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </a>
                      </div>
                    </div>

                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </div>
    </section>

    {/* ── Lightbox Poster Modal ── */}
    <AnimatePresence>
      {lightbox && (
        <motion.div
          key="poster-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Poster ${lightbox.title}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }
          }
          onClick={() => setLightbox(null)}
        >
          <motion.div
            className="relative"
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 24 }
            }
            animate={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 12 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 300, damping: 26 }
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[85vh] max-w-[92vw] sm:max-w-4xl">
              <Image
                src={lightbox.posterUrl || "/placeholder.png"}
                alt={lightbox.title}
                width={900}
                height={1200}
                loading="lazy"
                className="w-auto h-auto max-h-[85vh] max-w-[92vw] sm:max-w-4xl object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
                unoptimized
              />
            </div>

            {/* Tombol tutup */}
            <button
              type="button"
              autoFocus
              onClick={() => setLightbox(null)}
              aria-label="Tutup poster"
              className="absolute -top-3.5 -right-3.5 p-2 bg-white text-gray-800 rounded-full shadow-lg hover:bg-gray-100 hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
