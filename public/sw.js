// Dummy service worker (no caching)
self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
});

self.addEventListener("fetch", (event) => {
  // Force all fetches to go online only
  event.respondWith(fetch(event.request));
});
