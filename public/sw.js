/* JN UKMI UNS - PWA service worker.
 *
 * Strategy (conservative - never cache API/SSR data):
 * - navigations          → network-first, fallback to cache when offline
 * - /_next/static assets → stale-while-revalidate (fast repeat loads)
 * - images / fonts       → cache-first with background revalidate
 * - everything else      → passthrough (never cached)
 */

const STATIC_CACHE = "jnukmi-static-v1";
const PAGE_CACHE = "jnukmi-pages-v1";

const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => cache.add(OFFLINE_URL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== PAGE_CACHE)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Next.js hashed static chunks - SWR.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // Static images/fonts from our own origin - SWR.
  if (/\.(png|jpe?g|webp|avif|gif|svg|ico|woff2?|otf|ttf)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // Page navigations - network-first with offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }
});

/** Network-first: fresh when online, serve last good page offline. */
async function networkFirst(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
      trimCache(cache, PAGE_CACHE, 20);
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    const offline = await caches.match(OFFLINE_URL);
    if (offline) return offline;
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

/** Batasi ukuran cache agar tidak membengkak tak terkendali (LRU sederhana). */
async function trimCache(cache, cacheName, maxEntries) {
  try {
    const keys = await cache.keys();
    if (keys.length > maxEntries) {
      // Hapus entri terlama sampai muat dalam batas.
      for (const key of keys.slice(0, keys.length - maxEntries)) {
        await cache.delete(key);
      }
    }
  } catch {
    // abaikan - kegagalan pruning tidak fatal.
  }
}

/** Stale-while-revalidate: serve cache instantly, update in background. */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}
