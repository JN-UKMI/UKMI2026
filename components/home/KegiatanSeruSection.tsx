"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight, MapPin, Calendar, X, ZoomIn } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { KegiatanSeruItem } from "@/lib/types";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

const EMPTY_SUBSCRIBE = () => () => undefined;

interface KegiatanSeruSectionProps {
  initialEvents?: KegiatanSeruItem[];
}

export function KegiatanSeruSection({ initialEvents = [] }: KegiatanSeruSectionProps) {
  const events = initialEvents;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [lightbox, setLightbox] = useState<KegiatanSeruItem | null>(null);
  const lightboxTriggerRef = useRef<HTMLButtonElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement | null>(null);
  const lightboxContentRef = useRef<HTMLDivElement | null>(null);
  const lightboxWasOpenRef = useRef(false);
  const mounted = useSyncExternalStore(
    EMPTY_SUBSCRIBE,
    () => true,
    () => false
  );
  const shouldReduceMotion = useReducedMotion();

  // Kunci scroll body, trap fokus, & tutup lightbox dengan Escape.
  useEffect(() => {
    if (!lightbox) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setLightbox(null);
        return;
      }

      if (e.key !== "Tab") return;
      const closeButton = lightboxCloseRef.current;
      if (!closeButton) return;

      // The close button is the only focusable control in the dialog.
      e.preventDefault();
      closeButton.focus();
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!lightboxContentRef.current?.contains(e.target as Node)) {
        lightboxCloseRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocusIn);

    // Move focus before hiding the background from assistive technology.
    lightboxCloseRef.current?.focus();

    // Isolate the complete page background while the portal dialog is open.
    const portal = document.querySelector<HTMLElement>("[data-lightbox-portal]");
    const backgroundNodes = Array.from(document.body.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement && node !== portal
    );
    const previousBackgroundState = backgroundNodes.map((node) => ({
      node,
      inert: node.hasAttribute("inert"),
      ariaHidden: node.getAttribute("aria-hidden"),
    }));
    backgroundNodes.forEach((node) => {
      node.setAttribute("inert", "");
      node.setAttribute("aria-hidden", "true");
    });
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => lightboxCloseRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocusIn);
      previousBackgroundState.forEach(({ node, inert, ariaHidden }) => {
        if (inert) node.setAttribute("inert", "");
        else node.removeAttribute("inert");
        if (ariaHidden === null) node.removeAttribute("aria-hidden");
        else node.setAttribute("aria-hidden", ariaHidden);
      });
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  // Return focus to the card that opened the dialog after the lightbox closes.
  useEffect(() => {
    if (lightbox) {
      lightboxWasOpenRef.current = true;
      return;
    }

    if (!lightboxWasOpenRef.current) return;
    lightboxWasOpenRef.current = false;
    const trigger = lightboxTriggerRef.current;
    const frame = window.requestAnimationFrame(() => {
      if (trigger?.isConnected) trigger.focus();
      lightboxTriggerRef.current = null;
    });
    return () => window.cancelAnimationFrame(frame);
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
    <LayoutGroup id="event-poster-layout">
      <>
    <section className="py-12 sm:py-20 px-3 sm:px-6 bg-transparent transition-colors duration-300 relative overflow-visible">

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
        <div className="relative overflow-x-clip overflow-y-visible px-5 -mx-5">
          <StaggerContainer className="overflow-visible">
            <div
              className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6 py-5 sm:py-6"
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
                    className="relative bg-white dark:bg-gray-900/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 border-gray-200/90 dark:border-gray-800 shadow-md hover:shadow-xl hover:border-emerald-500 dark:hover:border-lime dark:hover:shadow-[0_0_30px_rgba(73,154,19,0.25)] transition-all duration-300 group flex flex-row w-full overflow-hidden hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none z-10 hover:z-30 select-none"
                  >
                    
                    {/* Left Column: Poster Container (Always Horizontal side by side) */}
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      aria-label={`Event ${item.title}. Klik untuk melihat poster.`}
                      aria-hidden={lightbox?.id === item.id ? true : undefined}
                      tabIndex={lightbox?.id === item.id ? -1 : 0}
                      onClick={(e) => {
                        lightboxTriggerRef.current = e.currentTarget;
                        setLightbox(item);
                      }}
                      className={`relative w-[125px] min-[400px]:w-[145px] sm:w-5/12 self-stretch min-h-full shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800/90 transition-opacity duration-150 text-left cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lime motion-reduce:transform-none motion-reduce:transition-none ${lightbox?.id === item.id ? "pointer-events-none" : ""}`}
                      style={{ opacity: lightbox?.id === item.id ? 0 : 1 }}
                    >
                      <motion.div
                        layoutId={shouldReduceMotion ? undefined : `event-poster-${item.id}`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute inset-0"
                      >
                      <Image
                        src={item.posterUrl || "/placeholder.png"}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 150px, 400px"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-108 motion-reduce:transform-none motion-reduce:transition-none"
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-black/30 opacity-60 group-hover:opacity-40 transition-opacity motion-reduce:transition-none" />

                      {/* Affordance: klik untuk memperbesar poster */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:transition-none">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-[10px] sm:text-xs font-bold shadow-lg">
                          <ZoomIn className="w-3.5 h-3.5" />
                          Perbesar
                        </span>
                      </div>
                      </motion.div>
                    </button>

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

                      {/* Outline CTA with a left-to-right fill reveal on button hover */}
                      <div className="pt-1.5 sm:pt-2 border-t border-gray-100 dark:border-gray-800/80">
                        <a
                          href={item.instagramUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="group/detail relative isolate block w-full overflow-hidden rounded-xl sm:rounded-2xl border border-forest-600 dark:border-lime bg-transparent text-forest-700 dark:text-lime text-[11px] sm:text-sm font-bold sm:font-black transition-colors duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50"
                        >
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-forest-600 dark:bg-lime motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover/detail:translate-x-0"
                          />
                          <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-6 sm:py-3 transition-colors duration-300 motion-reduce:transition-none group-hover/detail:text-white dark:group-hover/detail:text-forest-950">
                            <span>Lihat Detail</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 motion-safe:group-hover/detail:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
                          </span>
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

    {/* ── Lightbox Poster Modal (Mounted on document.body to stay above Navbar & Music FAB) ── */}
    {mounted &&
      createPortal(
        <AnimatePresence>
          {lightbox && (
            <motion.div
              key="poster-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`Poster ${lightbox.title}`}
              data-lightbox-portal
              className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/92 backdrop-blur-md p-4 sm:p-8 overflow-hidden select-none"
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }
              }
              onClick={() => setLightbox(null)}
            >
              <motion.div
                ref={lightboxContentRef}
                layoutId={shouldReduceMotion ? undefined : `event-poster-${lightbox.id}`}
                className="relative"
                initial={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }
                }
                animate={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
                }
                exit={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 320, damping: 25 }
                }
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative max-h-[85vh] max-w-[92vw] sm:max-w-4xl flex items-center justify-center">
                  <Image
                    src={lightbox.posterUrl || "/placeholder.png"}
                    alt={lightbox.title}
                    width={900}
                    height={1200}
                    loading="lazy"
                    className="w-auto h-auto max-h-[85vh] max-w-[92vw] sm:max-w-4xl object-contain rounded-2xl shadow-2xl ring-1 ring-white/20"
                    unoptimized
                  />
                </div>

                {/* Tombol silang kecil di kanan atas poster */}
                <button
                  ref={lightboxCloseRef}
                  type="button"
                  onClick={() => setLightbox(null)}
                  aria-label="Tutup poster"
                  className="absolute -top-3.5 -right-3.5 sm:-top-4 sm:-right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-50 flex items-center justify-center border border-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      </>
    </LayoutGroup>
  );
}
