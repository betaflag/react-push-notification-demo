/**
 * Registers a Service Worker to receive Push Notification.
 *
 * Push Server URL is set using `REACT_APP_PUSH_SERVER` environment variable.
 * The content of the service worker is located at `/public/push-service-worker.js`
 *
 * Steps:
 * 1. Register a Servirce Worker to the navigator
 * 2. Subscribe the Service Worker to the navigator's Notification API
 * 3. Register the Notification API to the Push Server to receive push notificaitons
 */

export function register() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service worker not supported.");
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${process.env.PUBLIC_URL}/push-service-worker.js`)
      .then(subscribeServiceWorker)
      .then(registerPushServer)
      .catch(error => {
        console.log("Service worker registration failed with " + error);
      });
  });
}

/**
 * Subscribe to the navagitor's push manager using the
 * Push server's public VAPID key.
 *
 * @param {ServiceWorkerRegistration} registration
 */
async function subscribeServiceWorker(registration) {
  // Fetch the public VAPID key from the server
  const response = await fetch(
    `${process.env.REACT_APP_PUSH_SERVER}/vapidPublicKey`
  );
  const vapidPublicKey = await response.text();

  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
  };

  return registration.pushManager.subscribe(subscribeOptions);
}

/**
 * Register the navigator's subscription to the Push Server.
 *
 * @param {PushSubscription} pushSubscription
 */
function registerPushServer(pushSubscription) {
  fetch(`${process.env.REACT_APP_PUSH_SERVER}/register`, {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ subscription: pushSubscription })
  });

  return pushSubscription;
}

/**
 * Converts a URL-safe base64 string ot a Int array.
 *
 * @param {String} base64String
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
