"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight, MapPin, Calendar } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { KegiatanSeruItem } from "@/lib/types";

interface KegiatanSeruSectionProps {
  initialEvents?: KegiatanSeruItem[];
}

export function KegiatanSeruSection({ initialEvents = [] }: KegiatanSeruSectionProps) {
  const [events, setEvents] = useState<KegiatanSeruItem[]>(initialEvents);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);

  useEffect(() => {
    if (initialEvents.length === 0) {
      fetchEvents();
    }
  }, [initialEvents]);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/admin/kegiatan");
      if (res.ok) {
        const data = await res.json();
        if (data.events) setEvents(data.events);
      }
    } catch {}
  };

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
    <section className="py-16 px-4 bg-transparent transition-colors duration-300 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="relative mb-8 text-center">
          <SectionHeader
            icon={<Sparkles className="w-6 h-6 text-forest-600 dark:text-lime" />}
            title="Event Terdekat"
            subtitle="Berbagai kegiatan menarik yang bikin kamu makin berkembang!"
          />

          {/* Carousel Controls (If events exceed visible count) */}
          {events.length > visibleCards && (
            <div className="flex items-center justify-center sm:justify-end gap-2 mt-4 sm:mt-0 sm:absolute sm:top-2 sm:right-0">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                aria-label="Kegiatan sebelumnya"
                className={`p-2.5 rounded-full border transition-all duration-200 cursor-pointer ${
                  currentIndex === 0
                    ? "border-gray-200 text-gray-300 dark:border-gray-800 dark:text-gray-700 cursor-not-allowed opacity-50"
                    : "border-forest-600/30 text-forest-800 hover:bg-forest-600 hover:text-white dark:border-lime/40 dark:text-lime dark:hover:bg-lime dark:hover:text-forest-950 shadow-sm"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                aria-label="Kegiatan berikutnya"
                className={`p-2.5 rounded-full border transition-all duration-200 cursor-pointer ${
                  currentIndex >= maxIndex
                    ? "border-gray-200 text-gray-300 dark:border-gray-800 dark:text-gray-700 cursor-not-allowed opacity-50"
                    : "border-forest-600/30 text-forest-800 hover:bg-forest-600 hover:text-white dark:border-lime/40 dark:text-lime dark:hover:bg-lime dark:hover:text-forest-950 shadow-sm"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
            }}
          >
            {events.map((item) => (
              <div
                key={item.id}
                className="w-full lg:w-[calc(50%-12px)] shrink-0"
              >
                <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col sm:flex-row h-full transition-all duration-300 group hover:shadow-2xl hover:border-forest-600 dark:hover:border-lime dark:hover:shadow-[0_0_25px_rgba(73,154,19,0.35)]">
                  {/* Left Column: Full Portrait Poster with Date Badge */}
                  <div className="relative w-full sm:w-5/12 aspect-[3/4] shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={item.posterUrl || "/placeholder.png"}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    {/* Top Left Floating Date Badge */}
                    <div className="absolute top-4 left-4 flex flex-col items-center justify-center px-3.5 py-2 rounded-2xl bg-indigo-600/90 dark:bg-forest-600/90 text-white backdrop-blur-md shadow-lg border border-white/20">
                      <span className="text-xl sm:text-2xl font-black leading-none">
                        {item.dayBadge}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-0.5 opacity-90">
                        {item.monthBadge}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Information & Action Button */}
                  <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 gap-4 sm:w-7/12">
                    <div className="space-y-3">
                      {/* Event Title */}
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-snug group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">
                        {item.title}
                      </h3>

                      {/* Date & Location */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-forest-700 dark:text-lime/90">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.date}</span>
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal line-clamp-3 pt-1">
                        {item.description}
                      </p>
                    </div>

                    {/* Action Button: Lihat Detail */}
                    <div className="pt-2">
                      <a
                        href={item.instagramUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 group/btn"
                      >
                        <span>Lihat Detail</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
