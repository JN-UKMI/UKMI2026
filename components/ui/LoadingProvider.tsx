"use client";

import { createContext, useContext, useState, useEffect } from "react";
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
  const [displayChildren, setDisplayChildren] = useState<React.ReactNode>(children);
  const isFirstRender = useState(true);

  // Handle Initial Load
  useEffect(() => {
    isFirstRender[1](false);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Sync children changes and delay loading screen dismissal until they are mounted
  useEffect(() => {
    if (isTransitioning && phase === "entering") {
      setDisplayChildren(children);
      
      const slideOutTimeout = setTimeout(() => {
        setIsTransitioning(false);
        setPhase("idle");
      }, 1000); // 1000ms paint buffer

      return () => clearTimeout(slideOutTimeout);
    } else if (!isTransitioning) {
      setDisplayChildren(children);
    }
  }, [children, isTransitioning, phase]);

  // Handle programmatic routing with transition delays
  const navigateWithTransition = (href: string) => {
    if (pathname === href) return;

    // STEP 1: Slide in the loading screen from left to center
    setPhase("exiting");
    setIsTransitioning(true);

    // STEP 2: When screen is fully covered, trigger route push and hold for 1s
    const swapTimeout = setTimeout(() => {
      router.push(href);
      setPhase("entering");
    }, 1000);

    return () => {
      clearTimeout(swapTimeout);
    };
  };

  const showLoader = isLoading || (isTransitioning && phase !== "idle");

  // Determine horizontal X positions based on current loading states
  // This guarantees a single persistent overlay element that does not trigger unmount flashes
  let animateX: string | number = 0;
  if (showLoader) {
    if (isLoading) animateX = 0;
    else if (phase === "exiting") animateX = 0;
    else if (phase === "entering") animateX = "100%";
  }

  return (
    <TransitionContext.Provider value={{ navigateWithTransition }}>
      {/* 
        Single continuous motion container:
        Eliminates the blank flash frames caused by AnimatePresence component swaps.
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
              ease: [0.76, 0, 0.24, 1], // Cubic-bezier slide ease
            }}
            className="fixed inset-0 z-[9999] pointer-events-auto"
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="w-full min-h-screen">
        {displayChildren}
      </div>
    </TransitionContext.Provider>
  );
}
