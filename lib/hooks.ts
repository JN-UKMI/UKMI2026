import { useEffect, useState } from "react";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
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
