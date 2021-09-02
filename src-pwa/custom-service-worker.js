/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { NetworkFirst } from "workbox-strategies";
import { Queue } from "workbox-background-sync";

// Use with precache injection
self.__WB_DISABLE_DEV_LOGS = true;
precacheAndRoute(self.__WB_MANIFEST);

let backgroundSyncSupported = "sync" in self.registration ? true : false;

let createPostQueue = null;
if (backgroundSyncSupported) {
  createPostQueue = new Queue("createPostQueue", {
    onSync: async ({ queue }) => {
      let entry;
      while ((entry = await queue.shiftRequest())) {
        try {
          await fetch(entry.request);
          console.log("Replay successfully for request ", entry.request);

          const channel = new BroadcastChannel("sw-messages");
          channel.postMessage({ msg: "offline-post-uploaded" });
        } catch (err) {
          await queue.unshiftRequest(entry);
          throw error;
        }
      }
    }
  });
}

registerRoute(
  ({ url }) => url.host.startsWith("fonts.g"),
  new CacheFirst({
    cacheName: "google-fonts",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/posts"),
  new NetworkFirst()
);

registerRoute(
  ({ url }) => url.href.startsWith("http"),
  new StaleWhileRevalidate()
);

if (backgroundSyncSupported) {
  self.addEventListener("fetch", event => {
    if (event.request.url.endsWith("/createPost")) {
      if (event.request.method !== "POST") {
        return;
      }

      const bgSyncLogic = async () => {
        try {
          const response = await fetch(event.request.clone());
          return response;
        } catch (error) {
          await createPostQueue.pushRequest({ request: event.request });
          return error;
        }
      };

      event.respondWith(bgSyncLogic());
    }
    // Add in your own criteria here to return early if this
    // isn't a request that should use background sync.
  });
}

self.addEventListener("notificationclick", event => {
  let notification = event.notification;
  let action = event.action;

  if (action == "hello") {
    console.log("Hello button was clicked");
  } else if (action == "goodbye") {
    console.log("Goodbye button was clicked");
  } else {
    console.log("Main button was clicked");
  }

  notification.close();
});
