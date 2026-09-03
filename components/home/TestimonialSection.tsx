"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { MessageSquareQuote, Quote as QuoteIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import type { TestimonialItem } from "@/lib/types";

interface TestimonialSectionProps {
  testimonials: TestimonialItem[];
}

export function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine items per view: Desktop (>=1024px): 3 cards, Tablet (>=768px): 2 cards, Mobile (<768px): 1 card
  useEffect(() => {
    function updateItemsPerView() {
      if (window.innerWidth >= 1024) {
        setItemsPerView(Math.min(3, testimonials.length));
      } else if (window.innerWidth >= 768) {
        setItemsPerView(Math.min(2, testimonials.length));
      } else {
        setItemsPerView(1);
      }
    }

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  // Clamp index if viewport resize changes maxIndex
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const goToIndex = useCallback((i: number) => {
    setCurrentIndex(Math.min(Math.max(0, i), maxIndex));
  }, [maxIndex]);

  // Touch swipe handling for mobile / tablet
  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < maxIndex) {
      goToNext();
    } else if (isRightSwipe && currentIndex > 0) {
      goToPrev();
    }
  };

  const showControls = testimonials.length > itemsPerView;

  return (
    <section className="relative overflow-hidden py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-transparent transition-colors duration-300">
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeader
          icon={<MessageSquareQuote className="w-6 h-6 text-forest-600 dark:text-lime" />}
          title="Pesan & Kesan Alumni"
          subtitle="Refleksi dan nasihat inspiratif dari Ketua Umum JN UKMI dari masa ke masa"
        />

        {/* Carousel Container */}
        <div className="mt-4 sm:mt-6" ref={containerRef}>
          {/* Slider Track Wrapper */}
          <div className="overflow-hidden py-3 -mx-2.5 sm:-mx-3.5 px-0.5">
            <motion.div
              className="flex items-stretch"
              animate={{
                x: `-${currentIndex * (100 / itemsPerView)}%`,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.15 }
                  : { type: "spring", stiffness: 280, damping: 30 }
              }
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  className="shrink-0 h-auto flex flex-col px-2.5 sm:px-3.5"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <TestimonialCard item={item} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Carousel Controls & Indicators */}
          {showControls && (
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6">
              {/* Prev Button */}
              <button
                onClick={goToPrev}
                disabled={currentIndex === 0}
                aria-label="Testimoni sebelumnya"
                className={`p-2.5 rounded-full border transition-all cursor-pointer hover:shadow-md motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 ${
                  currentIndex === 0
                    ? "border-gray-200 text-gray-300 dark:border-gray-800 dark:text-gray-700 opacity-40 cursor-not-allowed"
                    : "border-lime/30 text-forest-800 hover:bg-forest-600 hover:text-white dark:border-lime/40 dark:text-lime dark:hover:bg-lime dark:hover:text-forest-950 shadow-xs"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dot Indicators */}
              <div className="flex items-center gap-1">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToIndex(i)}
                    aria-label={`Ke testimoni ${i + 1}`}
                    className="p-2 min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 rounded-full"
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        i === currentIndex
                          ? "w-7 sm:w-8 h-2.5 bg-forest-600 dark:bg-lime shadow-xs"
                          : "w-2.5 h-2.5 bg-gray-300 dark:bg-gray-700 group-hover:bg-gray-400 dark:group-hover:bg-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={goToNext}
                disabled={currentIndex >= maxIndex}
                aria-label="Testimoni berikutnya"
                className={`p-2.5 rounded-full border transition-all cursor-pointer hover:shadow-md motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 ${
                  currentIndex >= maxIndex
                    ? "border-gray-200 text-gray-300 dark:border-gray-800 dark:text-gray-700 opacity-40 cursor-not-allowed"
                    : "border-lime/30 text-forest-800 hover:bg-forest-600 hover:text-white dark:border-lime/40 dark:text-lime dark:hover:bg-lime dark:hover:text-forest-950 shadow-xs"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Reusable testimonial card with landscape proportion, scrollable text when long, and equal height */
function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-5.5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:shadow-forest-900/5 dark:hover:shadow-lime/5 motion-safe:hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full">
      {/* Decorative Quote Watermark */}
      <div className="absolute top-3 right-3.5 text-forest-600/[0.06] dark:text-lime/[0.06] group-hover:text-forest-600/15 dark:group-hover:text-lime/15 transition-colors pointer-events-none select-none">
        <QuoteIcon className="w-7 h-7 rotate-180" />
      </div>

      {/* Testimonial Text - scrollable when long, double height */}
      <div className="relative z-10 flex-1 flex flex-col justify-center mb-3 pr-3 min-h-[168px] sm:min-h-[192px]">
        <div className="overflow-y-auto pr-1 max-h-full">
          <p className="text-gray-600 dark:text-gray-400 text-[13px] leading-relaxed italic">
            &ldquo;{item.testimoni}&rdquo;
          </p>
        </div>
      </div>

      {/* Author Info - compact row */}
      <div className="relative z-10 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2.5 shrink-0">
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden ring-2 ring-forest-600/20 dark:ring-lime/30 bg-gray-100 dark:bg-gray-800"
        >
          <Image
            src={item.foto || "/image/laki-laki.png"}
            alt={item.nama}
            fill
            sizes="36px"
            loading="lazy"
            className="object-cover"
          />
        </motion.div>
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="font-bold text-xs text-gray-900 dark:text-white leading-tight truncate">
            {item.nama}
          </h3>
          <p className="text-[11px] text-forest-600 dark:text-lime font-semibold truncate mt-px">
            {item.periode}
          </p>
          {item.kabinet && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate">
              {item.kabinet}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
