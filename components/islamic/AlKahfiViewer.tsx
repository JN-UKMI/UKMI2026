"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AyatCard } from "./AyatCard";
import { SlideIn } from "@/components/ui/SlideIn";
import { ArrowUp, Eye, EyeOff } from "lucide-react";

interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
}

interface AlKahfiViewerProps {
  ayatList: Ayat[];
}

export function AlKahfiViewer({ ayatList }: AlKahfiViewerProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showGlobalLatin, setShowGlobalLatin] = useState(true);
  const [showGlobalTranslation, setShowGlobalTranslation] = useState(true);
  const [bookmarkedAyat, setBookmarkedAyat] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Read saved bookmark on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBookmark = localStorage.getItem("ukmi_alkahfi_bookmark");
      if (savedBookmark) {
        const ayatNum = parseInt(savedBookmark, 10);
        if (!isNaN(ayatNum)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved bookmark on mount
          setBookmarkedAyat(ayatNum);
        }
      }
    }
  }, []);

  const toggleBookmark = (nomorAyat: number) => {
    if (bookmarkedAyat === nomorAyat) {
      setBookmarkedAyat(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("ukmi_alkahfi_bookmark");
      }
    } else {
      setBookmarkedAyat(nomorAyat);
      if (typeof window !== "undefined") {
        localStorage.setItem("ukmi_alkahfi_bookmark", String(nomorAyat));
      }
    }
  };

  // Handle back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 relative">
      {/* Global Toggle Toolbar */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="flex flex-wrap items-center justify-end gap-3 pr-2"
      >
        {/* Toggle Latin */}
        <motion.button
          type="button"
          whileHover={shouldReduceMotion ? undefined : { y: -1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          onClick={() => setShowGlobalLatin(!showGlobalLatin)}
          aria-pressed={showGlobalLatin}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 shadow-sm border-2 cursor-pointer hover:scale-105 active:scale-95 ${
            showGlobalLatin
              ? "bg-forest-600 dark:bg-forest-700 hover:bg-forest-800 text-white border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime hover:text-forest-700 dark:hover:text-lime hover:bg-forest-50 dark:hover:bg-gray-750"
          }`}
        >
          {showGlobalLatin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>Latin</span>
        </motion.button>

        {/* Toggle Terjemahan */}
        <motion.button
          type="button"
          whileHover={shouldReduceMotion ? undefined : { y: -1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          onClick={() => setShowGlobalTranslation(!showGlobalTranslation)}
          aria-pressed={showGlobalTranslation}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 shadow-sm border-2 cursor-pointer hover:scale-105 active:scale-95 ${
            showGlobalTranslation
              ? "bg-forest-600 dark:bg-forest-700 hover:bg-forest-800 text-white border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime hover:text-forest-700 dark:hover:text-lime hover:bg-forest-50 dark:hover:bg-gray-750"
          }`}
        >
          {showGlobalTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>Terjemahan</span>
        </motion.button>
      </motion.div>

      {/* Verses List — Renders all 110 verses directly, alternating slide-in per ayat */}
      <div className="space-y-6">
        {ayatList.map((ayat, idx) => {
          const direction = idx % 2 === 0 ? "left" : "right";
          return (
            <SlideIn key={ayat.nomorAyat} direction={direction}>
              <AyatCard
                nomorAyat={ayat.nomorAyat}
                teksArab={ayat.teksArab}
                teksLatin={ayat.teksLatin}
                teksIndonesia={ayat.teksIndonesia}
                showLatin={showGlobalLatin}
                showTranslation={showGlobalTranslation}
                isBookmarked={bookmarkedAyat === ayat.nomorAyat}
                onToggleBookmark={() => toggleBookmark(ayat.nomorAyat)}
              />
            </SlideIn>
          );
        })}
      </div>

      {/* Floating Action Button (FAB) Back to Top */}
      <motion.button
        type="button"
        onClick={handleBackToTop}
        whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.05 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        tabIndex={showBackToTop ? 0 : -1}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-forest-600 hover:bg-forest-800 text-white shadow-lg flex items-center justify-center transition-all duration-300 transform cursor-pointer active:scale-95 ${
          showBackToTop ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
        }`}
        aria-label="Kembali ke atas"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
