"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export interface Song {
  title: string;
  artist: string;
  src: string;
}

export const PLAYLIST: Song[] = [
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

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  isSingleLoop: boolean;
  currentTrackIndex: number;
  currentTrack: Song;
  isExpanded: boolean;
  isAllowedPage: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  toggleSingleLoop: () => void;
  nextTrack: () => void;
  handleFabClick: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Music plays on Home (/) and Tentang (/tentang)
  const isAllowedPage = pathname === "/" || pathname === "/tentang";

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSingleLoop, setIsSingleLoop] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load saved mute preference once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMute = localStorage.getItem("ukmi_music_muted");
      if (savedMute !== null) {
        setIsMuted(savedMute === "true");
      }
    }
  }, []);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Global Audio Instance initialization
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      const audio = new Audio(PLAYLIST[0].src);
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    const handleEnded = () => {
      if (audio.loop) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Update track src when index changes
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const isDifferentSrc = !audio.src.endsWith(currentTrack.src);
    if (isDifferentSrc) {
      audio.src = currentTrack.src;
      if (isPlaying && isAllowedPage) {
        audio.play().catch(() => {});
      }
    }
  }, [currentTrackIndex, isPlaying, isAllowedPage, currentTrack.src]);

  // Pause when navigating away from allowed pages, resume when entering
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (!isAllowedPage) {
      if (!audio.paused) {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      audio.muted = isMuted;
      audio.loop = isSingleLoop;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            audio.muted = true;
            setIsMuted(true);
            if (typeof window !== "undefined") {
              localStorage.setItem("ukmi_music_muted", "true");
            }
            audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          });
      }
    }
  }, [isAllowedPage]);

  // Sync mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("ukmi_music_muted", isMuted ? "true" : "false");
    }
  }, [isMuted]);

  // Sync loop state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isSingleLoop;
    }
  }, [isSingleLoop]);

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

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    audioRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  const toggleSingleLoop = () => {
    setIsSingleLoop((prev) => !prev);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handleFabClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      toggleMute();
    } else {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        isSingleLoop,
        currentTrackIndex,
        currentTrack,
        isExpanded,
        isAllowedPage,
        togglePlay,
        toggleMute,
        toggleSingleLoop,
        nextTrack,
        handleFabClick,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
