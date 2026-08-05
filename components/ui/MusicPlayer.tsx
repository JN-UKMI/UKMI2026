"use client";

import { Music, VolumeX } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useMusic } from "./MusicContext";

export function MusicPlayer() {
  const { isPlaying, isAllowedPage, togglePlay } = useMusic();
  const shouldReduceMotion = useReducedMotion();

  if (!isAllowedPage) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Floating Toggle Button (Music / Mute Toggle FAB) */}
      <motion.button
        whileHover={shouldReduceMotion ? undefined : { scale: 1.15, y: -4 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 20 }}
        onClick={togglePlay}
        className={`flex h-12 w-12 items-center justify-center rounded-full shadow-[0_10px_25px_-5px_rgba(24,35,15,0.3)] border-2 transition-all cursor-pointer ${
          isPlaying
            ? "bg-forest-600 text-white border-lime animate-pulse ring-4 ring-forest-100 dark:ring-forest-900/50"
            : "bg-forest-900 dark:bg-gray-800 text-white dark:text-lime border-lime/80 hover:bg-forest-950 dark:hover:bg-gray-700"
        }`}
        aria-label={isPlaying ? "Matikan Musik" : "Putar Musik"}
        title={isPlaying ? "Matikan Musik (Doa Rabithah)" : "Putar Musik (Doa Rabithah)"}
      >
        {isPlaying ? (
          <Music className="w-5 h-5 animate-spin-slow" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  );
}
