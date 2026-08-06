"use client";

import { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Music,
  Gauge,
} from "lucide-react";

interface MasuratAudioPlayerProps {
  src?: string;
  title?: string;
  artist?: string;
}

export function MasuratAudioPlayer({
  src = "/music/Al-Masurat-Hanan_Attaki-64k.mp3",
  title = "Al-Ma'tsurat (Pagi & Petang)",
  artist = "Ustadz Hanan Attaki",
}: MasuratAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Playback error:", err));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const cycleSpeed = () => {
    const nextIdx = (SPEED_OPTIONS.indexOf(playbackRate) + 1) % SPEED_OPTIONS.length;
    const newSpeed = SPEED_OPTIONS[nextIdx];
    setPlaybackRate(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        Math.max(0, audioRef.current.currentTime + seconds),
        duration
      );
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-forest-300 dark:hover:border-lime/50 hover:shadow-lg hover:shadow-forest-900/5 dark:hover:shadow-lime/10 transition-all duration-300"
    >
      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        autoPlay={false}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left Column: Track Info */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto">
          <motion.div
            animate={shouldReduceMotion || !isPlaying ? undefined : { rotate: [0, 4, -4, 0] }}
            transition={shouldReduceMotion || !isPlaying ? undefined : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-12 h-12 rounded-xl bg-forest-50 dark:bg-gray-800 border border-forest-100 dark:border-gray-700 flex items-center justify-center shrink-0 text-forest-600 dark:text-lime transition-all duration-300 motion-safe:group-hover:scale-105 motion-safe:group-hover:rotate-2 group-hover:shadow-md group-hover:shadow-forest-900/10"
          >
            <Music className="w-6 h-6" />
          </motion.div>

          <div className="overflow-hidden min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 bg-forest-50 dark:bg-forest-950/60 text-forest-700 dark:text-lime border border-forest-200/80 dark:border-forest-800 rounded-md text-[10px] font-bold uppercase tracking-wider">
                Murottal Audio
              </span>
              {isPlaying && (
                <span className="text-[10px] text-forest-600 dark:text-lime font-bold">
                  ● Sedang Diputar
                </span>
              )}
            </div>

            <h4 className="text-sm sm:text-base font-bold text-forest-900 dark:text-white truncate leading-snug">
              {title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
              {artist}
            </p>
          </div>
        </div>

        {/* Right Column: Player Controls & Progress Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto flex-1 max-w-2xl bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-100 dark:border-gray-750">
          {/* Main Playback Buttons */}
          <div className="flex items-center justify-center gap-1.5 shrink-0">
            {/* Rewind -10s */}
            <button
              type="button"
              onClick={() => skip(-10)}
              className="px-2 py-1.5 bg-white dark:bg-gray-700 border border-gray-200/80 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-forest-300 dark:hover:border-lime/50 hover:shadow-sm rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40"
              title="Mundur 10 Detik"
            >
              <Rewind className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">-10s</span>
            </button>

            {/* Play / Pause Button */}
            <motion.button
              type="button"
              onClick={togglePlay}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
              className="w-10 h-10 rounded-xl bg-forest-600 hover:bg-forest-700 dark:bg-forest-700 dark:hover:bg-forest-600 text-white flex items-center justify-center shadow-xs hover:shadow-lg hover:shadow-forest-900/20 motion-safe:hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/50"
              title={isPlaying ? "Jeda Audio" : "Putar Audio Murottal"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </motion.button>

            {/* FastForward +10s */}
            <button
              type="button"
              onClick={() => skip(10)}
              className="px-2 py-1.5 bg-white dark:bg-gray-700 border border-gray-200/80 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-forest-300 dark:hover:border-lime/50 hover:shadow-sm rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40"
              title="Maju 10 Detik"
            >
              <span className="text-[10px] font-bold">+10s</span>
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Bar & Timers */}
          <div className="flex flex-col gap-1 w-full flex-1">
            <div className="flex items-center justify-between text-[11px] font-mono font-medium text-gray-500 dark:text-gray-400 px-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex items-center cursor-pointer">
              <div
                className="h-full bg-forest-600 dark:bg-lime transition-all duration-150 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>

          {/* Secondary Controls: Speed & Mute */}
          <div className="flex items-center gap-1.5 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 sm:border-l border-gray-200 dark:border-gray-700 sm:pl-3">
            {/* Speed Button */}
            <button
              type="button"
              onClick={cycleSpeed}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200/80 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 active:scale-95 shadow-2xs"
              title="Kecepatan Putar Audio"
            >
              <Gauge className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
              <span>{playbackRate}x</span>
            </button>

            {/* Mute Button */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-white dark:bg-gray-700 border border-gray-200/80 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer active:scale-95 shadow-2xs"
              title={isMuted ? "Aktifkan Suara" : "Bisukan Suara"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-red-500" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
