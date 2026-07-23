"use client";

import Image from "next/image";
import { MessageSquareQuote, Quote as QuoteIcon } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import type { TestimonialItem } from "@/lib/types";

interface TestimonialSectionProps {
  testimonials: TestimonialItem[];
}

export function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="bg-slate-50 dark:bg-gray-950 py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200/60 dark:border-gray-800/80 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          icon={<MessageSquareQuote className="w-6 h-6 text-forest-600 dark:text-lime" />}
          title="Pesan & Kesan Alumni"
          subtitle="Refleksi dan nasihat inspiratif dari Ketua Umum JN UKMI dari masa ke masa"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Decorative Quote Watermark */}
              <div className="absolute top-6 right-6 text-forest-600/10 dark:text-lime/10 group-hover:text-forest-600/20 dark:group-hover:text-lime/20 transition-colors">
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
                <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden border-2 border-forest-600/30 dark:border-lime/50 bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={item.foto || "/image/members/default-ikhwan.svg"}
                    alt={item.nama}
                    fill
                    sizes="48px"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-forest-900 dark:text-lime truncate">
                    {item.nama}
                  </h3>
                  <p className="text-xs text-forest-600 dark:text-gray-300 font-semibold truncate">
                    {item.periode}
                  </p>
                  {item.kabinet && (
                    <span className="text-[11px] text-gray-400 dark:text-gray-400 font-medium truncate">
                      {item.kabinet}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
