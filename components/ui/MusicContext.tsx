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
  togglePlay: () => void;
  toggleMute: () => void;
  toggleSingleLoop: () => void;
  nextTrack: () => void;
  handleFabClick: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Music plays ONLY on Home (/) and Tentang (/tentang)
  const isAllowedPage = pathname === "/" || pathname === "/tentang";

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSingleLoop, setIsSingleLoop] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pause & stop music immediately when user leaves allowed pages (/ and /tentang)
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
    }
  }, [pathname]);

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

  // Attempt Autoplay on Mount & Handle Browser Autoplay Policy on First User Interaction
  useEffect(() => {
    if (typeof window === "undefined" || !isAllowedPage) return;

    if (!audioRef.current) {
      const audio = new Audio(PLAYLIST[0].src);
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    audio.muted = isMuted;
    audio.loop = isSingleLoop;

    const startAudio = () => {
      if (!audioRef.current) return;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser blocks un-muted autoplay, try muted play then unmute on interaction
          if (audioRef.current) {
            audioRef.current.muted = true;
            audioRef.current
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          }
        });
    };

    // 1. Immediate Autoplay Attempt
    startAudio();

    // 2. Fallback: Listen for any user gesture (click, scroll, keypress, touch) to force play
    const handleFirstUserInteraction = () => {
      if (audioRef.current) {
        audioRef.current.muted = false;
        setIsMuted(false);
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("keydown", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
      window.removeEventListener("scroll", handleFirstUserInteraction);
    };

    window.addEventListener("click", handleFirstUserInteraction, { once: true });
    window.addEventListener("keydown", handleFirstUserInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstUserInteraction, { once: true });
    window.addEventListener("scroll", handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("keydown", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
      window.removeEventListener("scroll", handleFirstUserInteraction);
    };
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
