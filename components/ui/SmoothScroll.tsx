"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

/**
 * SmoothScroll - wraps the page with Lenis smooth scrolling.
 *
 * Features:
 * - Smooth inertia-based scrolling that respects reduced-motion
 * - Uses native scroll interpolation for zero-lag on mobile
 * - Properly destroys on unmount to prevent memory leaks
 * - Resets scroll and recalculates dimensions on route change
 * - Recalculates the scroll limit whenever page content height
 *   changes (tab switches, lazy images, font swaps, late-mounted
 *   sections) so the user can always reach the true bottom via
 *   the scrollbar or the wheel.
 *
 * Place this in the root layout around the main content area.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    // Skip smooth scroll when user prefers reduced motion
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
      wheelMultiplier: 1,
      lerp: 0.1,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  // ── Reset Lenis on route change ──────────────────────────────
  // When navigating between pages, Lenis retains the scroll limits
  // from the previous page. Without a resize + scroll-to-top, long
  // pages appear truncated until the user manually refreshes.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis || shouldReduceMotion) return;

    // Double rAF ensures the new page's layout + paint cycle
    // has fully completed before Lenis recalculates dimensions.
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lenis.resize();
        lenis.scrollTo(0, { immediate: true });
      });
    });

    return () => cancelAnimationFrame(raf1);
  }, [pathname, shouldReduceMotion]);

  // ── Recalc scroll limit on content changes ───────────────────
  // Lenis caches `limit` (scrollHeight - viewport height). Ganti tab,
  // gambar lazy yang baru dimuat, font swap, dan section yang render
  // belakangan mengubah tinggi halaman TANPA memicu window resize,
  // sehingga limit basi dan user tidak bisa scroll sampai bawah.
  // Pantau mutasi DOM + load gambar + load font, lalu panggil
  // lenis.resize() (dithrottle per frame via rAF).
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis || shouldReduceMotion || typeof document === "undefined") return;

    let rafId = 0;
    const scheduleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => lenis.resize());
    };

    const observer = new MutationObserver(scheduleResize);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const onImageLoad = () => scheduleResize();
    // Capture phase: `load` event pada <img> tidak bubble, tapi bisa
    // ditangkap dari window dengan capture = true.
    window.addEventListener("load", onImageLoad, true);

    document.fonts?.ready.then(scheduleResize).catch(() => undefined);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("load", onImageLoad, true);
    };
  }, [pathname, shouldReduceMotion]);

  return <>{children}</>;
}
