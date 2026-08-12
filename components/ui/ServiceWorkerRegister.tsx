"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker (public/sw.js) so the site can be
 * installed on home screens and works offline for cached assets.
 *
 * - Only runs in production — in dev the SW would interfere with Fast Refresh.
 * - No-op when `navigator.serviceWorker` is unavailable (older browsers).
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") return;

    navigator.serviceWorker
      .register("/sw.js")
      .catch(() => {
        // Non-fatal — the site works fine without a SW.
      });
  }, []);

  return null;
}
