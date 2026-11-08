/*
 * sw.js - Hayyak photo helper (service worker)
 *
 * Hayyak has no server-side storage, so when the admin adds a site photo, the
 * original file is kept in the browser (Cache Storage) under a normal path such as
 * "images/uploads/site-17-1.jpg". This helper answers requests for those paths, so
 * every page shows the photo with a plain <img src="images/uploads/..."> tag,
 * exactly like the photos in the images folder, in its original size and quality.
 */
const UPLOADS = "hayyak-uploads";

self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (event) { event.waitUntil(self.clients.claim()); });

self.addEventListener("fetch", function (event) {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  /* always ask the server for the newest scripts and styles, so a changed file is used
     right away without a hard refresh (the server answers quickly when nothing changed) */
  const type = event.request.destination;
  if (type === "script" || type === "style") {
    event.respondWith(
      fetch(event.request.url, { cache: "no-cache" }).catch(function () { return fetch(event.request); })
    );
    return;
  }

  if (url.pathname.indexOf("/images/uploads/") === -1) return;
  event.respondWith(
    caches.open(UPLOADS)
      .then(function (cache) { return cache.match(url.origin + url.pathname); })
      .then(function (found) { return found || fetch(event.request); })
  );
});
