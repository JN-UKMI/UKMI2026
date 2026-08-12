"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text?: string;
  /** Absolute URL of the article (or the path, resolved client-side). */
  url: string;
  className?: string;
}

/**
 * Tombol "Bagikan" artikel — memakai Web Share API bila tersedia
 * (mobile), fallback ke salin link ke clipboard, dengan feedback
 * visual "Tersalin!" selama 2 detik.
 */
export function ShareButton({ title, text, url, className = "" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const notifyCopied = useCallback(() => {
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleShare = useCallback(async () => {
    const shareUrl =
      typeof window !== "undefined" ? new URL(url, window.location.origin).toString() : url;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User membatalkan (AbortError) atau share gagal — fallback ke clipboard.
        if ((err as Error)?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      notifyCopied();
    } catch {
      // Clipboard tidak tersedia (http non-secure) — fallback terakhir: prompt.
      window.prompt("Salin link artikel ini:", shareUrl);
    }
  }, [notifyCopied, text, title, url]);

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? "Link tersalin" : "Bagikan artikel"}
      title={copied ? "Link tersalin!" : "Bagikan artikel"}
      className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-xl px-3 py-1.5 border transition-all duration-300 cursor-pointer active:scale-95 ${
        copied
          ? "border-lime bg-lime/10 text-forest-700 dark:text-lime"
          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-lime hover:text-forest-700 dark:hover:text-lime hover:bg-lime/10"
      } ${className}`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
      <span>{copied ? "Tersalin!" : "Bagikan"}</span>
    </button>
  );
}
