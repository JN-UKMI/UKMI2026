"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* ── Shared single IntersectionObserver (module-level) ──
   Instead of one observer per SlideIn instance (which kills perf on pages
   with 100+ elements like Al-Kahfi), we register all elements into one
   observer. The WeakMap automatically cleans up when elements are GC'd. */

type SlideCallback = (el: HTMLDivElement, isVisible: boolean) => void;
const slideCallbacks = new WeakMap<HTMLDivElement, SlideCallback>();

function getSharedObserver(): IntersectionObserver {
  if (typeof window === "undefined") {
    // SSR guard — return a dummy that does nothing
    return { observe() {}, unobserve() {}, disconnect() {} } as unknown as IntersectionObserver;
  }
  const key = "__ukmi_slide_observer__";
   
  const existing = (window as any)[key] as IntersectionObserver | undefined;
  if (existing) return existing;

  const obs = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLDivElement;
        const cb = slideCallbacks.get(el);
        if (cb) cb(el, entry.intersectionRatio >= 0.2);
      }
    },
    { threshold: [0, 0.2, 0.5] }
  );
   
  (window as any)[key] = obs;
  return obs;
}

/**
 * SlideIn — wraps children with a reusable translateX slide animation.
 * Replays every time the element enters/exits the viewport during scroll.
 *
 * Uses a single shared IntersectionObserver for all instances — safe
 * even on pages with 100+ elements (e.g. Al-Kahfi 110 ayat).
 */
export function SlideIn({
  children,
  direction = "left",
  stagger = false,
  className = "",
}: {
  children: ReactNode;
  direction?: "left" | "right";
  stagger?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Use smaller offset on mobile screens to prevent off-screen horizontal displacement
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const distance = isMobile ? 32 : 80;
    const offset = direction === "left" ? -distance : distance;

    // Set initial offset via JS after first paint to avoid layout gap
    const raf = requestAnimationFrame(() => {
      el.style.transform = `translateX(${offset}px)`;
    });

    // Register into shared observer
    slideCallbacks.set(el, (_el, isVisible) => {
      if (isVisible) {
        _el.classList.add("slide-visible");
      } else {
        _el.classList.remove("slide-visible");
      }
    });

    const observer = getSharedObserver();

    // Defer observe slightly so above-fold elements still get their
    // initial offset painted before the observer fires
    const timer = setTimeout(() => observer.observe(el), 250);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      observer.unobserve(el);
      slideCallbacks.delete(el);
    };
  }, [direction]);

  const slideClass = direction === "left" ? "slide-left" : "slide-right";

  return (
    <div
      ref={ref}
      className={`${slideClass} ${stagger ? "slide-stagger" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
