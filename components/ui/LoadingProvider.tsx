"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { motion, AnimatePresence } from "framer-motion";

type TransitionContextType = {
  navigateWithTransition: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within a TransitionProvider");
  }
  return context;
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState<"idle" | "exiting" | "entering">("idle");

  // Track whether we're in the middle of a programmatic navigation
  const isNavigating = useRef(false);
  const isFirstRender = useRef(true);

  // ── Handle Initial Page Load ──────────────────────────────────
  useEffect(() => {
    isFirstRender.current = false;
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // ── KEY FIX: Watch pathname changes as the "page is ready" signal ──
  // Next.js App Router only updates usePathname() AFTER the new route's
  // React tree has been fully committed to the DOM. This means the
  // destination page is actually rendered before we dismiss the loader.
  useEffect(() => {
    // Skip the very first render (initial page load)
    if (isFirstRender.current) return;

    // Only act if we initiated this navigation ourselves
    if (!isNavigating.current) return;

    // Pathname changed = new page is ready. Start dismissal with a short
    // visual buffer (300ms) so the user sees the page "land" smoothly.
    isNavigating.current = false;

    const dismissTimeout = setTimeout(() => {
      setPhase("entering"); // slide loading screen out to the right
      // Wait for the slide-out animation to finish, then clean up
      const cleanupTimeout = setTimeout(() => {
        setIsTransitioning(false);
        setPhase("idle");
      }, 700); // matches the motion transition duration (0.6s + buffer)
      return () => clearTimeout(cleanupTimeout);
    }, 300); // small buffer so the new page paints before loader leaves

    return () => clearTimeout(dismissTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // ← pathname changing = page is ready

  // ── Initiate a route transition ────────────────────────────────
  const navigateWithTransition = (href: string) => {
    if (pathname === href) return;

    // STEP 1: Mark navigation as in-progress and slide loading screen in
    isNavigating.current = true;
    setPhase("exiting");
    setIsTransitioning(true);

    // STEP 2: After loading screen fully covers the viewport (~600ms animation),
    // trigger the actual route change. The loading screen will then stay
    // visible until usePathname() reports the new route is ready (above effect).
    const swapTimeout = setTimeout(() => {
      router.push(href);
      // Note: we do NOT set phase="entering" here anymore.
      // The pathname useEffect handles dismissal once the page is truly ready.
    }, 700); // wait for exiting slide animation to complete

    return () => clearTimeout(swapTimeout);
  };

  const showLoader = isLoading || (isTransitioning && phase !== "idle");

  // Determine horizontal X position of the loading overlay
  let animateX: string | number = 0;
  if (showLoader) {
    if (isLoading) animateX = 0;
    else if (phase === "exiting") animateX = 0;      // fully visible, covering page
    else if (phase === "entering") animateX = "100%"; // sliding out to the right
  }

  return (
    <TransitionContext.Provider value={{ navigateWithTransition }}>
      {/*
        Single persistent overlay — no AnimatePresence unmount flash.
        Slides in from left, stays until page is ready, slides out to right.
      */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="persistent-global-loader"
            initial={{ x: isLoading ? 0 : "-100%" }}
            animate={{ x: animateX }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.6,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="fixed inset-0 z-[9999] pointer-events-auto"
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full min-h-screen">
        {children}
      </div>
    </TransitionContext.Provider>
  );
}
