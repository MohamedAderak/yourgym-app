
const SHELL = "yourgym-shell-mw0za3gr", MEDIA = "yourgym-media-v1";
const FILES = ["./","./assets/index-Dol5VZZr.css","./assets/index-BznR227u.js","./manifest.webmanifest","./icons/apple-touch-icon.png","./icons/icon-192.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(SHELL).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("yourgym-shell-") && k !== SHELL).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // App shell: cache first, fall back to the cached index for navigations.
    e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).catch(() => req.mode === "navigate" ? caches.match("./") : Response.error())));
    return;
  }
  if (req.destination === "image") {
    // Exercise media: cache first, store new images as they are viewed.
    e.respondWith(caches.open(MEDIA).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }))));
  }
});