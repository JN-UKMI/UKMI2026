import { useState, useEffect } from "react";

function useMediaQuery(query: string) {
  // Lazy initializer reads the current match synchronously, avoiding
  // setState-in-effect. The effect only subscribes to future changes.
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    // Sync in case the lazy initializer was stale (rare edge case with
    // dynamic query changes — still safe because no cascading renders).
    if (media.matches !== matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync initial match, guarded against unnecessary updates
      setMatches(media.matches);
    }
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
    // Only re-subscribe when query string changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}

/**
 * Returns true when the viewport is narrow enough to be considered mobile.
 * Useful for disabling heavy animations on low-power/touch-first devices.
 */
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

/**
 * Returns true when the primary input is a coarse pointer (touch).
 * Useful for skipping hover-driven animations.
 */
export function useIsTouchDevice() {
  return useMediaQuery("(pointer: coarse)");
}
