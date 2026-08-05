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
    artist: "JN UKMI UNS",
    src: "/music/all-1.mp3",
  },
  {
    title: "Harmoni Ukhuwah",
    artist: "JN UKMI UNS",
    src: "/music/all-2.mp3",
  },
  {
    title: "Teruslah Bergerak",
    artist: "Azzam Haroki",
    src: "/music/TeruslahBergerak-AzzamHaroki.mp3",
  },
  {
    title: "Kabinet Iskandar Muda",
    artist: "JN UKMI UNS",
    src: "/music/kabinet.mp3",
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
  isSingleTrackOnly: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  toggleSingleLoop: () => void;
  nextTrack: () => void;
  handleFabClick: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Music plays on Home (/), Tentang (/tentang), Bidang Syiar (/bidang/syiar), and Kabinet (/kabinet)
  const isAllowedPage =
    pathname === "/" ||
    pathname === "/tentang" ||
    pathname === "/bidang/syiar" ||
    pathname === "/kabinet";

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSingleLoop, setIsSingleLoop] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pause & stop music immediately when user leaves allowed pages
  useEffect(() => {
    if (!isAllowedPage && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isAllowedPage]);

  // Load saved mute preference once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMute = localStorage.getItem("ukmi_music_muted");
      if (savedMute !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved mute preference
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
      audio.preload = "none";
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

  // Switch track automatically based on active page route
  useEffect(() => {
    if (pathname === "/") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- switch track based on active route
      setCurrentTrackIndex(0);
    } else if (pathname === "/tentang") {
      setCurrentTrackIndex(1);
    } else if (pathname === "/bidang/syiar") {
      setCurrentTrackIndex(2);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else if (pathname === "/kabinet") {
      setCurrentTrackIndex(3);
    }
  }, [pathname]);

  // Update track src when index changes
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const isDifferentSrc = !audio.src.endsWith(currentTrack.src);
    if (isDifferentSrc) {
      audio.src = currentTrack.src;
      if (isPlaying && isAllowedPage && pathname !== "/bidang/syiar") {
        audio.play().catch(() => {});
      }
    }
  }, [currentTrackIndex, isPlaying, isAllowedPage, currentTrack.src, pathname]);

  // Prepare audio; playback starts only after the user uses the player.
  useEffect(() => {
    if (typeof window === "undefined" || !isAllowedPage) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.src);
    }

    const audio = audioRef.current;
    audio.muted = isMuted;
    audio.loop = isSingleLoop;
  }, [currentTrack.src, isAllowedPage, isMuted, isSingleLoop]);

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

  const isSingleTrackOnly = pathname === "/bidang/syiar" || pathname === "/kabinet";

  const nextTrack = () => {
    if (isSingleTrackOnly) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        if (isPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }
      return;
    }
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handleFabClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      if (isMuted) {
        // One-click: unmute + start playing
        toggleMute();
        if (!isPlaying) {
          audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      } else {
        // Mute to silence
        toggleMute();
      }
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
        isSingleTrackOnly,
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
