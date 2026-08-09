"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

/**
 * SmoothScroll — wraps the page with Lenis smooth scrolling.
 * 
 * Features:
 * - Smooth inertia-based scrolling that respects reduced-motion
 * - Uses native scroll interpolation for zero-lag on mobile
 * - Properly destroys on unmount to prevent memory leaks
 * - Resets scroll and recalculates dimensions on route change
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

  return <>{children}</>;
}
