"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Target, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { FadeIn } from "@/components/ui/motion";

interface ProgramKerjaCarouselProps {
  program_kerja: Array<{ title: string; description: string; tanggal?: string; target?: string }>;
}

export function ProgramKerjaCarousel({ program_kerja }: ProgramKerjaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  const itemsToShow = program_kerja || [];

  // Handle responsive visible card counts
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const maxIndex = Math.max(0, itemsToShow.length - visibleCards);

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && currentIndex < maxIndex) {
      nextSlide();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevSlide();
    }
  };

  // Fallback untuk data yang belum diisi
  const fallbackTargets = ["Triwulan I", "Triwulan II", "Bulanan", "Setiap Semester", "Kondisional", "Pekanan"];
  const fallbackTarget = (i: number) => fallbackTargets[i % fallbackTargets.length];

  return (
    <section className="bg-transparent py-20 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto relative">
        <FadeIn direction="up">
          <SectionHeader
            icon={<Sparkles className="w-6 h-6" />}
            title="Program Kerja Unggulan"
            subtitle="Daftar agenda kegiatan dan program kerja utama bidang"
          />
        </FadeIn>

        {/* Carousel Container */}
        <FadeIn delay={0.2}>
          <div className="relative px-2 sm:px-12 w-full overflow-hidden">
          {/* Slider viewport */}
          <div
            className="overflow-hidden w-full touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <motion.div
              className="flex gap-6"
              animate={{ x: `calc(-${currentIndex * (100 / visibleCards)}% - ${currentIndex * (24 / visibleCards)}px)` }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 110, damping: 24 }}
            >
              {itemsToShow.map((prog, i) => {
                const tanggal = prog.tanggal || fallbackTarget(i);
                const target = prog.target || "Program Kerja Bidang";
                return (
                  <motion.div
                    key={i}
                    whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.015 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="group w-full shrink-0 md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-forest-900/10 dark:hover:shadow-lime/10 hover:border-forest-300 dark:hover:border-lime/50 border border-gray-200/50 dark:border-gray-800 flex flex-col justify-between h-[360px] transition-all duration-300"
                  >
                    <div>
                      {/* Top Bar: Number & Icon */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-forest-600/10 dark:bg-forest-900/50 text-forest-700 dark:text-lime font-mono text-xs font-bold border border-forest-600/20 dark:border-forest-800 transition-transform duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:rotate-3">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <Target className="w-5 h-5 text-lime transition-transform duration-300 motion-safe:group-hover:rotate-12 motion-safe:group-hover:scale-110" />
                      </div>

                      <h3 className="card-title-underline font-black text-xl text-forest-900 dark:text-lime mb-3 leading-[1.75]">
                        {prog.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
                        {prog.description}
                      </p>
                    </div>

                    {/* Bottom Details Pill */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
                        {tanggal}
                      </span>
                      <span className="flex items-center gap-1 text-forest-700 dark:text-lime font-bold">
                        <Target className="w-3.5 h-3.5 text-lime" />
                        {target}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            aria-label="Previous Slide"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-forest-900 dark:text-lime disabled:opacity-30 disabled:cursor-not-allowed hover:bg-forest-600 dark:hover:bg-forest-700 hover:text-white dark:hover:text-lime hover:border-forest-600 hover:shadow-lg motion-safe:hover:-translate-y-[calc(50%_+_0.125rem)] transition-all z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            aria-label="Next Slide"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-forest-900 dark:text-lime disabled:opacity-30 disabled:cursor-not-allowed hover:bg-forest-600 dark:hover:bg-forest-700 hover:text-white dark:hover:text-lime hover:border-forest-600 hover:shadow-lg motion-safe:hover:-translate-y-[calc(50%_+_0.125rem)] transition-all z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        </FadeIn>

        {/* Dots Indicator */}
        <div className="flex justify-center items-center gap-1 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/50 dark:focus-visible:ring-lime/60"
            >
              <span
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "w-8 bg-forest-600 dark:bg-lime"
                    : "w-2.5 bg-gray-300 dark:bg-gray-700 group-hover:bg-gray-400 dark:group-hover:bg-gray-600"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
