import { useCallback, useSyncExternalStore } from "react";

const getServerMediaQuerySnapshot = () => false;

function useMediaQuery(query: string) {
  // Keep the server snapshot deterministic. The browser value is read only
  // after hydration, preventing a touch/desktop mismatch in SSR markup.
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof window === "undefined") return () => undefined;
    const media = window.matchMedia(query);
    media.addEventListener("change", onStoreChange);
    return () => media.removeEventListener("change", onStoreChange);
  }, [query]);

  const getSnapshot = useCallback(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerMediaQuerySnapshot
  );
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
