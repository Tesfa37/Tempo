// Tempo service worker — manual Workbox-free implementation.
// next-pwa is incompatible with --turbopack builds; this file
// provides the same cache strategies without webpack plugin dependency.

const CACHE_VERSION = "v1";
const CACHES = {
  pages: `tempo-pages-${CACHE_VERSION}`,
  passports: `tempo-passports-${CACHE_VERSION}`,
  images: `tempo-images-${CACHE_VERSION}`,
  static: `tempo-static-${CACHE_VERSION}`,
};

const ALL_CACHE_NAMES = Object.values(CACHES);

// Install: skip waiting so the new SW activates immediately
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate: delete caches from previous versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !ALL_CACHE_NAMES.includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: return cached immediately, refresh in background.
// Used for passport pages so they're readable offline once visited.
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached ?? (await networkFetch);
}

// Cache-first: serve from cache, only hit network on miss.
// Used for product images and hashed Next.js static chunks.
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

// Network-first: try network, fall back to cache on failure.
// Used for API routes and most pages.
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached ?? Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only intercept same-origin GETs
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  const path = url.pathname;

  // Next.js hashed static bundles — content-addressed, safe to cache forever
  if (path.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, CACHES.static));
    return;
  }

  // Product images and Next.js image optimization — cache-first
  if (path.startsWith("/images/") || path.startsWith("/_next/image")) {
    event.respondWith(cacheFirst(request, CACHES.images));
    return;
  }

  // Passport pages — stale-while-revalidate for offline access
  if (path === "/passport" || path.startsWith("/passport/")) {
    event.respondWith(staleWhileRevalidate(request, CACHES.passports));
    return;
  }

  // API routes — network-first with cached fallback
  if (path.startsWith("/api/")) {
    event.respondWith(networkFirst(request, CACHES.pages));
    return;
  }

  // Homepage and all other routes — network-first
  event.respondWith(networkFirst(request, CACHES.pages));
});
