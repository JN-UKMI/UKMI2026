"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Play, Pause, Volume2, VolumeX, SkipForward, Music, Repeat, Repeat1 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Song {
  title: string;
  artist: string;
  src: string;
}

const PLAYLIST: Song[] = [
  {
    title: "Mars Pemuda Islam",
    artist: "Azzam Haroki",
    src: "/music/lagu-1.mp3",
  },
  {
    title: "Teruslah Bergerak",
    artist: "Azzam Haroki",
    src: "/music/lagu-2.mp3",
  },
];

export function MusicPlayer() {
  const pathname = usePathname();

  // Only render on Home (/) and Tentang (/tentang)
  const isAllowedPage = pathname === "/" || pathname === "/tentang";

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSingleLoop, setIsSingleLoop] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Initialize and handle playback loop
  useEffect(() => {
    if (!isAllowedPage) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    const audio = new Audio(currentTrack.src);
    audioRef.current = audio;
    audio.muted = isMuted;
    audio.loop = isSingleLoop;

    // Handle song end: repeat single song if isSingleLoop is true, else skip to next in playlist
    const handleEnded = () => {
      if (audioRef.current && audioRef.current.loop) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      } else {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
      }
    };

    audio.addEventListener("ended", handleEnded);

    // Auto Play automatically upon page load / route enter
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Browser autoplay restriction: start muted fallback if unmuted autoplay is blocked by browser policy
          audio.muted = true;
          setIsMuted(true);
          audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        });
    }

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, [currentTrackIndex, isAllowedPage]);

  // Sync loop attribute on native Audio element whenever isSingleLoop state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isSingleLoop;
    }
  }, [isSingleLoop]);

  // Sync mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle manual play / pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuteState = !isMuted;
    audioRef.current.muted = nextMuteState;
    setIsMuted(nextMuteState);
  };

  // Skip to next track
  const nextTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  // Handle FAB Click: direct mute toggle on mobile (<768px), expand menu on desktop (>=768px)
  const handleFabClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      toggleMute();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  if (!isAllowedPage) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
      {/* Floating Toggle Button (Music Badge) */}
      <motion.button
        whileHover={{ scale: 1.15, y: -4 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
        onClick={handleFabClick}
        className={`flex h-12 w-12 items-center justify-center rounded-full shadow-[0_10px_25px_-5px_rgba(24,35,15,0.3)] border-2 transition-all cursor-pointer ${
          isPlaying && !isMuted
            ? "bg-forest-600 text-white border-lime animate-pulse ring-4 ring-forest-100"
            : "bg-forest-900 text-white border-lime/80 hover:bg-forest-950"
        }`}
        aria-label={isMuted ? "Bunyikan Musik" : "Bisu Musik"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Music className={`w-5 h-5 ${isPlaying ? "animate-spin-slow" : ""}`} />
        )}
      </motion.button>

      {/* Expanded Player Control Bar (Desktop only: hidden on mobile) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="hidden md:flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-xl border border-gray-200/80 text-gray-800"
          >
            {/* Song Info */}
            <div className="flex flex-col max-w-[140px] sm:max-w-[180px]">
              <span className="text-xs font-bold truncate text-forest-900 leading-tight">
                {currentTrack.title}
              </span>
              <span className="text-[10px] font-medium text-gray-400 truncate">
                {currentTrack.artist}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-forest-600 hover:bg-forest-800 text-white flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              {/* Next Track */}
              <button
                onClick={nextTrack}
                className="p-1.5 rounded-full text-gray-500 hover:text-forest-600 hover:bg-gray-100 transition-all cursor-pointer"
                aria-label="Lagu berikutnya"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Single Track Loop Toggle */}
              <button
                onClick={() => setIsSingleLoop(!isSingleLoop)}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  isSingleLoop
                    ? "text-forest-600 bg-forest-100 font-bold"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                }`}
                title={isSingleLoop ? "Ulang 1 Lagu Aktif" : "Ulang Seluruh Playlist"}
                aria-label={isSingleLoop ? "Ulang 1 Lagu Aktif" : "Ulang Seluruh Playlist"}
              >
                {isSingleLoop ? <Repeat1 className="w-4 h-4 text-forest-600" /> : <Repeat className="w-4 h-4" />}
              </button>

              {/* Mute / Unmute */}
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-full text-gray-500 hover:text-forest-600 hover:bg-gray-100 transition-all cursor-pointer"
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
