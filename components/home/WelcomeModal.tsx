"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Music,
  Flame,
  HandHeart,
  BookOpen,
  Sun,
  Share2,
  Check,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SESSION_KEY = "ukmi_welcome_popup_seen_session_v2";
const PERMANENT_KEY = "ukmi_welcome_popup_dismissed_permanent";

// In-memory tracker across client-side page transitions
let hasShownInSessionMemory = false;

export function WelcomeModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);

    try {
      const isPermanentDismissed = localStorage.getItem(PERMANENT_KEY) === "true";
      const isSeenInSession = sessionStorage.getItem(SESSION_KEY) === "true" || hasShownInSessionMemory;

      if (!isPermanentDismissed && !isSeenInSession) {
        hasShownInSessionMemory = true;

        timerRef.current = setTimeout(() => {
          setIsOpen(true);
          try {
            sessionStorage.setItem(SESSION_KEY, "true");
          } catch {
            // Ignore
          }
        }, 900);
      }
    } catch {
      // Storage access fallback
      if (!hasShownInSessionMemory) {
        hasShownInSessionMemory = true;
        timerRef.current = setTimeout(() => {
          setIsOpen(true);
        }, 900);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // Ignore
    }
  };

  const handleDismissPermanent = () => {
    try {
      localStorage.setItem(PERMANENT_KEY, "true");
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // Ignore
    }
    setIsOpen(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: "Tentang Masa Terang Milikmu — JN UKMI UNS",
      text: "Tetap teguh di jalan kebaikan gaes! Warisan akal budi gemilang ✨",
      url: "https://jnukmi.com",
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    // Fallback copy to clipboard
    try {
      await navigator.clipboard.writeText("https://jnukmi.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Copy failed
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wrp-title"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 350, damping: 28 }
            }
            className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 border-2 border-forest-600 dark:border-lime rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-gray-800 dark:text-gray-100"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Tutup popup"
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-forest-50 dark:bg-gray-800 text-forest-700 dark:text-lime border border-forest-200 dark:border-gray-700 transition-all hover:bg-forest-100 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="relative pt-6 sm:pt-8 px-6 sm:px-8 pb-4 text-center border-b border-gray-100 dark:border-gray-800 bg-forest-50/50 dark:bg-gray-900/60">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-600 dark:bg-lime text-white dark:text-forest-950 rounded-full text-xs font-bold shadow-sm mb-3">
                <Music className="w-3.5 h-3.5" />
                <span>Perunggu • Gemilang</span>
              </div>

              <h2
                id="wrp-title"
                className="text-xl sm:text-2xl font-black text-forest-900 dark:text-lime leading-snug tracking-tight"
              >
                Tentang Masa Terang<br />Milikmu, Gaes! ✨
              </h2>
              <p className="text-xs sm:text-sm font-medium text-forest-700/80 dark:text-gray-400 mt-1">
                seperti lagu Gemilang — <em className="italic">kebul jalan kuterjang</em>
              </p>
            </div>

            {/* Body (Scrollable) */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-5 text-sm">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium bg-forest-50/40 dark:bg-gray-800/40 p-3.5 rounded-2xl border border-forest-100 dark:border-gray-800">
                Kayak lirik Perunggu — <em className="italic">“terjilat matahari timur yang kejam, sengat melekat di bahuku”</em> — tapi kamu tetep nerjang gaes. Itu bukan lemah, itu <strong className="text-forest-800 dark:text-lime font-black">gemilang</strong>. Dan Allah liat semua usahamu. 🌟
              </p>

              {/* Feature Cards Grid */}
              <div className="space-y-3">
                {/* Feat 1 */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 shadow-xs hover:border-lime dark:hover:border-lime transition-all">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-50 dark:bg-lime/10 text-forest-700 dark:text-lime border border-forest-200 dark:border-lime/30">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <strong className="text-forest-900 dark:text-white font-bold block mb-0.5">Kepala Batu itu Berkah lho!</strong>
                    <span className="italic text-forest-700/80 dark:text-lime/90 text-xs block mb-1">“Karena ini yang kumau, berkah kepala yang batu”</span>
                    Teguh di jalan kebaikan? That’s literally azimah — sunnah banget, no cap! 💪
                  </div>
                </div>

                {/* Feat 2 */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 shadow-xs hover:border-lime dark:hover:border-lime transition-all">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-50 dark:bg-lime/10 text-forest-700 dark:text-lime border border-forest-200 dark:border-lime/30">
                    <HandHeart className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <strong className="text-forest-900 dark:text-white font-bold block mb-0.5">Doa Mereka di Setiap Malammu!</strong>
                    <span className="italic text-forest-700/80 dark:text-lime/90 text-xs block mb-1">“Tertulis jelas namamu, di setiap harap malammu”</span>
                    Orang tuamu nyebut namamu tiap malam gaes — itu bahan bakar yang paling W! 🤲
                  </div>
                </div>

                {/* Feat 3 */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 shadow-xs hover:border-lime dark:hover:border-lime transition-all">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-50 dark:bg-lime/10 text-forest-700 dark:text-lime border border-forest-200 dark:border-lime/30">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <strong className="text-forest-900 dark:text-white font-bold block mb-0.5">Tinggalkan Sesuatu yang Nyata!</strong>
                    <span className="italic text-forest-700/80 dark:text-lime/90 text-xs block mb-1">“Warisan akal budi gemilang”</span>
                    Bukan follower atau views yang dikenang — tapi ilmu yang bermanfaat &amp; akhlak yang baik. Real legacy! 📚
                  </div>
                </div>

                {/* Feat 4 */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 shadow-xs hover:border-lime dark:hover:border-lime transition-all">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-50 dark:bg-lime/10 text-forest-700 dark:text-lime border border-forest-200 dark:border-lime/30">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <strong className="text-forest-900 dark:text-white font-bold block mb-0.5">Pelan-Pelan, Pasti Sampai!</strong>
                    <span className="italic text-forest-700/80 dark:text-lime/90 text-xs block mb-1">“Pelan pasti ku kabulkan segala catatan harapmu”</span>
                    Jalan kamu mungkin belum selesai, tapi arah kamu udah bener gaes. Keep going! ☀️
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/80 flex flex-col gap-3">
              <button
                onClick={handleShare}
                className="group/share relative isolate inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-forest-600 dark:bg-lime text-white dark:text-forest-950 py-3 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Link Berhasil Disalin! ✨</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Bagikan Semangat ke Squad! ✊</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 px-1">
                <span className="inline-flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-lime" /> jnukmi.com
                </span>
                <button
                  onClick={handleDismissPermanent}
                  className="font-medium hover:text-forest-600 dark:hover:text-lime transition-colors underline underline-offset-2 cursor-pointer focus-visible:outline-none"
                >
                  Jangan tampilkan lagi
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
