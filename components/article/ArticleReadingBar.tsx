"use client";

import { useEffect, useState } from "react";

/**
 * Reading progress bar - garis tipis di paling atas viewport yang mengisi
 * seiring scroll, memberi indikator seberapa jauh artikel sudah dibaca.
 * Di-throttle via requestAnimationFrame agar ringan.
 */
export function ArticleReadingBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const total = doc.scrollHeight - window.innerHeight;
        const current = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
        setProgress(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-forest-700 via-forest-500 to-lime shadow-[0_0_8px_rgba(142,205,4,0.5)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
