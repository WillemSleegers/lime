const CACHE_NAME = "webr-packages-v1"
const CACHE_HOSTS = ["repo.r-wasm.org", "webr.r-wasm.org"]

self.addEventListener("install", () => self.skipWaiting())
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()))

self.addEventListener("fetch", (event) => {
  let url
  try {
    url = new URL(event.request.url)
  } catch {
    return
  }

  if (!CACHE_HOSTS.includes(url.hostname)) return

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request)
      if (cached) return cached
      const response = await fetch(event.request)
      if (response.ok) cache.put(event.request, response.clone())
      return response
    })
  )
})
