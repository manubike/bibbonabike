const CACHE_NAME = "magona-offline-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./img/icononly.png",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://cdn.tailwindcss.com"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(APP_SHELL.map((url) => cache.add(url)))
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (
    url.hostname.includes("workers.dev") ||
    url.hostname.includes("firebasedatabase.app") ||
    url.hostname.includes("open-meteo.com") ||
    url.hostname.includes("overpass") ||
    url.hostname.includes("brouter.de") ||
    url.hostname.includes("project-osrm.org")
  ) {
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((networkResp) => {
          if (networkResp && networkResp.ok) {
            const copy = networkResp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy)).catch(() => {});
          }
          return networkResp;
        })
        .catch(() =>
          caches.match(req, { ignoreSearch: true })
            .then((m) => m || caches.match("./index.html", { ignoreSearch: true }))
            .then((m) => m || caches.match("./", { ignoreSearch: true }))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((networkResp) => {
          if (networkResp && (networkResp.ok || networkResp.type === "opaque")) {
            const copy = networkResp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return networkResp;
        })
        .catch(() =>
          caches.match(req, { ignoreSearch: true })
            .then((m) => m || new Response("", { status: 504, statusText: "Offline" }))
        );
    })
  );
});
