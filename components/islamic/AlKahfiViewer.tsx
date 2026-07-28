"use client";

import { useState, useEffect, useRef } from "react";
import { AyatCard } from "./AyatCard";
import { ArrowUp, Eye, EyeOff } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

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
  const [displayedCount, setDisplayedCount] = useState(10);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showGlobalLatin, setShowGlobalLatin] = useState(true);
  const [showGlobalTranslation, setShowGlobalTranslation] = useState(true);
  const [bookmarkedAyat, setBookmarkedAyat] = useState<number | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Read saved bookmark on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBookmark = localStorage.getItem("ukmi_alkahfi_bookmark");
      if (savedBookmark) {
        const ayatNum = parseInt(savedBookmark, 10);
        if (!isNaN(ayatNum)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved bookmark on mount
          setBookmarkedAyat(ayatNum);
          setDisplayedCount((prev) => Math.max(prev, Math.min(ayatNum + 5, ayatList.length)));
        }
      }
    }
  }, [ayatList.length]);

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

  // Load more verses when scrolled near bottom
  useEffect(() => {
    const currentTarget = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedCount((prev) => Math.min(prev + 10, ayatList.length));
        }
      },
      { threshold: 0.1, rootMargin: "300px" }
    );

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [ayatList.length]);

  // Handle back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayedAyat = ayatList.slice(0, displayedCount);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 relative">
      {/* Global Toggle Toolbar */}
      <div className="flex flex-wrap items-center justify-end gap-3 pr-2">
        {/* Toggle Latin */}
        <button
          onClick={() => setShowGlobalLatin(!showGlobalLatin)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border cursor-pointer active:scale-95 ${
            showGlobalLatin
              ? "bg-forest-600 dark:bg-forest-700 hover:bg-forest-750 text-white border-forest-600 dark:border-forest-700"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          {showGlobalLatin ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              Sembunyikan Latin
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              Tampilkan Latin
            </>
          )}
        </button>

        {/* Toggle Terjemahan */}
        <button
          onClick={() => setShowGlobalTranslation(!showGlobalTranslation)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border cursor-pointer active:scale-95 ${
            showGlobalTranslation
              ? "bg-forest-600 dark:bg-forest-700 hover:bg-forest-750 text-white border-forest-600 dark:border-forest-700"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          {showGlobalTranslation ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              Sembunyikan Terjemahan
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              Tampilkan Terjemahan
            </>
          )}
        </button>
      </div>

      {/* Verses List */}
      <StaggerContainer className="space-y-6">
        {displayedAyat.map((ayat) => (
          <StaggerItem key={ayat.nomorAyat}>
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
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Target for infinite scroll trigger */}
      {displayedCount < ayatList.length && (
        <div ref={observerRef} className="h-12 flex items-center justify-center py-4">
          <div className="w-6 h-6 rounded-full border-2 border-forest-600 border-t-transparent animate-spin" />
        </div>
      )}

      {/* Floating Action Button (FAB) Back to Top */}
      <button
        onClick={handleBackToTop}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-forest-600 hover:bg-forest-800 text-white shadow-lg flex items-center justify-center transition-all duration-300 transform cursor-pointer active:scale-95 ${
          showBackToTop ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
        }`}
        aria-label="Kembali ke atas"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
