"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageSquareQuote, Quote as QuoteIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { StaggerContainer, StaggerItem, CardMotion } from "@/components/ui/motion";
import type { TestimonialItem } from "@/lib/types";

interface TestimonialSectionProps {
  testimonials: TestimonialItem[];
}

export function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  if (!testimonials || testimonials.length === 0) return null;

  const maxIndex = Math.max(0, testimonials.length - 1);

  const goToPrev = () => { setDirection(-1); setCurrentIndex((prev) => Math.max(0, prev - 1)); };
  const goToNext = () => { setDirection(1); setCurrentIndex((prev) => Math.min(maxIndex, prev + 1)); };
  const goToIndex = (i: number) => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); };

  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-transparent transition-colors duration-300">
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeader
          icon={<MessageSquareQuote className="w-6 h-6 text-forest-600 dark:text-lime" />}
          title="Pesan & Kesan Alumni"
          subtitle="Refleksi dan nasihat inspiratif dari Ketua Umum JN UKMI dari masa ke masa"
        />

        {/* ── Desktop: 3-column grid / Mobile: carousel ── */}
        <div className="mt-12">
          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="overflow-hidden">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 30 * direction }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <TestimonialCard item={testimonials[currentIndex]} />
              </motion.div>
            </div>

            {/* Carousel Controls */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={goToPrev}
                  disabled={currentIndex === 0}
                  aria-label="Testimoni sebelumnya"
                  className={`p-2.5 rounded-full border transition-all cursor-pointer hover:shadow-md motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 ${
                    currentIndex === 0
                      ? "border-gray-200 text-gray-300 dark:border-gray-800 dark:text-gray-700 opacity-40"
                      : "border-forest-600/30 text-forest-800 hover:bg-forest-600 hover:text-white dark:border-lime/40 dark:text-lime dark:hover:bg-lime dark:hover:text-forest-950 shadow-sm"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Dot Indicators */}
                <div className="flex items-center gap-1">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToIndex(i)}
                      aria-label={`Testimoni ${i + 1}`}
                      className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 rounded-full"
                    >
                      <span
                        className={`block rounded-full transition-all ${
                          i === currentIndex
                            ? "w-7 h-2.5 bg-forest-600 dark:bg-lime"
                            : "w-2.5 h-2.5 bg-gray-300 dark:bg-gray-700 group-hover:bg-gray-400 dark:group-hover:bg-gray-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={goToNext}
                  disabled={currentIndex >= maxIndex}
                  aria-label="Testimoni berikutnya"
                  className={`p-2.5 rounded-full border transition-all cursor-pointer hover:shadow-md motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 ${
                    currentIndex >= maxIndex
                      ? "border-gray-200 text-gray-300 dark:border-gray-800 dark:text-gray-700 opacity-40"
                      : "border-forest-600/30 text-forest-800 hover:bg-forest-600 hover:text-white dark:border-lime/40 dark:text-lime dark:hover:bg-lime dark:hover:text-forest-950 shadow-sm"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Desktop Grid: hidden on mobile, shown on md+ */}
          <StaggerContainer className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <StaggerItem key={item.id}>
                <CardMotion className="h-full">
                  <TestimonialCard item={item} />
                </CardMotion>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

/** Reusable testimonial card — used by both carousel (mobile) and grid (desktop) */
function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border-2 border-forest-600 dark:border-lime shadow-sm hover:shadow-xl hover:shadow-forest-900/10 dark:hover:shadow-lime/10 motion-safe:hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
      {/* Decorative Quote Watermark */}
      <div className="absolute top-6 right-6 text-forest-600/10 dark:text-lime/10 group-hover:text-forest-600/25 dark:group-hover:text-lime/25 transition-colors">
        <QuoteIcon className="w-12 h-12 rotate-180" />
      </div>

      {/* Testimonial Text */}
      <div className="relative z-10 mb-8">
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed italic">
          &ldquo;{item.testimoni}&rdquo;
        </p>
      </div>

      {/* Author Info Card Bottom */}
      <div className="relative z-10 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden border-2 border-forest-600/30 dark:border-lime/50 bg-gray-100 dark:bg-gray-800 shadow-sm"
        >
          <Image
            src={item.foto || "/image/laki-laki.png"}
            alt={item.nama}
            fill
            sizes="48px"
            loading="lazy"
            className="object-cover"
          />
        </motion.div>
        <div className="flex flex-col min-w-0">
          <h3 className="card-title-underline font-bold text-sm sm:text-base text-forest-900 dark:text-lime leading-[1.75] group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">
            {item.nama}
          </h3>
          <p className="text-xs text-forest-600 dark:text-gray-300 font-semibold truncate">
            {item.periode}
          </p>
          {item.kabinet && (
            <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium truncate">
              {item.kabinet}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
