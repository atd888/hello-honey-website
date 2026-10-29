// No customer data, API responses or login tokens are cached.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (_) {}

  const title = typeof payload.title === "string" ? payload.title : "New Hello Honey booking";
  const body = typeof payload.body === "string"
    ? payload.body
    : "A new appointment request has arrived. Tap to review it.";

  event.waitUntil(self.registration.showNotification(title, {
    body,
    icon: "/admin-icon-192.png",
    badge: "/admin-icon-192.png",
    tag: "hello-honey-new-booking",
    renotify: true,
    data: { url: "/admin.html" }
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL("/admin.html", self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const existing = windows.find((windowClient) => windowClient.url.startsWith(self.location.origin));
    if (existing) {
      await existing.focus();
      if ("navigate" in existing && existing.url !== target) await existing.navigate(target);
      return;
    }
    await self.clients.openWindow(target);
  })());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.mode === "navigate" && url.origin === self.location.origin && url.pathname === "/admin.html") {
    event.respondWith(fetch(event.request).catch(() => new Response(
      '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hello Honey · Offline</title><body style="font:17px Arial;background:#f7f3eb;color:#413b2e;padding:40px;line-height:1.6"><h1>Hello Honey</h1><p>You are offline. Connect to the internet to load bookings and send payment links.</p><a href="/admin.html">Try again</a>',
      { headers: { "Content-Type": "text/html" } }
    )));
  }
});
