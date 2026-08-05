"use client";

import { Play, Pause, Volume2, VolumeX, SkipForward, Music, Repeat, Repeat1 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useMusic } from "./MusicContext";

export function MusicPlayer() {
  const {
    isPlaying,
    isMuted,
    isSingleLoop,
    isExpanded,
    isAllowedPage,
    isSingleTrackOnly,
    togglePlay,
    toggleMute,
    toggleSingleLoop,
    nextTrack,
    handleFabClick,
  } = useMusic();
  const shouldReduceMotion = useReducedMotion();

  if (!isAllowedPage) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
      {/* Floating Toggle Button (Music Badge) */}
      <motion.button
        whileHover={shouldReduceMotion ? undefined : { scale: 1.15, y: -4 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 20 }}
        onClick={handleFabClick}
        className={`flex h-12 w-12 items-center justify-center rounded-full shadow-[0_10px_25px_-5px_rgba(24,35,15,0.3)] border-2 transition-all cursor-pointer ${
          isPlaying && !isMuted
            ? "bg-forest-600 text-white border-lime animate-pulse ring-4 ring-forest-100 dark:ring-forest-900/50"
            : "bg-forest-900 dark:bg-gray-800 text-white dark:text-lime border-lime/80 hover:bg-forest-950 dark:hover:bg-gray-700"
        }`}
        aria-label={isMuted ? "Bunyikan Musik" : "Bisu Musik"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Music className={`w-5 h-5 ${isPlaying ? "animate-spin-slow" : ""}`} />
        )}
      </motion.button>

      {/* Expanded Player Control Bar (Desktop only) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -20, scale: 0.95 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, x: -20, scale: 0.95 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 24 }}
            className="hidden md:flex items-center gap-3 glass px-4 py-2.5 rounded-full shadow-xl border border-gray-200/80 dark:border-lime dark:ring-1 dark:ring-lime/30 text-gray-800 dark:text-gray-100 transition-colors"
          >
            {/* Controls Only */}
            <div className="flex items-center gap-1.5">
              {/* Play / Pause */}
              <button
                type="button"
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-forest-600 dark:bg-forest-700 hover:bg-forest-800 dark:hover:bg-forest-600 text-white flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              {/* Next Track (Hidden if only 1 song allowed on page) */}
              {!isSingleTrackOnly && (
                <button
                  type="button"
                  onClick={nextTrack}
                  className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-lime hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 dark:focus-visible:ring-lime"
                  aria-label="Lagu berikutnya"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              )}

              {/* Single Track Loop Toggle */}
              <button
                type="button"
                onClick={toggleSingleLoop}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  isSingleLoop
                    ? "text-forest-600 dark:text-lime bg-forest-100 dark:bg-forest-900/60 font-bold"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                title={isSingleLoop ? "Ulang 1 Lagu Aktif" : "Ulang Seluruh Playlist"}
                aria-label={isSingleLoop ? "Ulang 1 Lagu Aktif" : "Ulang Seluruh Playlist"}
              >
                {isSingleLoop ? <Repeat1 className="w-4 h-4 text-forest-600 dark:text-lime" /> : <Repeat className="w-4 h-4" />}
              </button>

              {/* Mute / Unmute */}
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-lime hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 dark:focus-visible:ring-lime"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
