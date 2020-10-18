// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

const testServiceWorker = true;
const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  // eslint-disable-next-line
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function register() {
  if ("serviceWorker" in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
      return;
    }

    // window.addEventListener('load', () => {
    //
    // const swUrl =
    //   process.env.NODE_ENV === "production"
    //     ? `${process.env.PUBLIC_URL}/service-worker.js`
    //     : "/sw.js";
    const swUrl = process.env.NODE_ENV === "production" ? `/sw.js` : "/sw.js";

   // console.log("swUrl", swUrl);
    registerValidSW(swUrl);

    // if (isLocalhost) {
    //   // This is running on localhost. Lets check if a service worker still exists or not.
    //   checkValidServiceWorker(swUrl);

    //   // Add some additional logging to localhost, pointing developers to the
    //   // service worker/PWA documentation.
    //   navigator.serviceWorker.ready.then(() => {
    //     console.log(
    //       'This web app is being served cache-first by a service ' +
    //         'worker. To learn more, visit https://goo.gl/SC7cgQ'
    //     );
    //   });
    // } else {
    //   // Is not local host. Just register service worker
    //   registerValidSW(swUrl);
    // }
    // });
  }
}
//
function sendSubscription(subscription) {
  const userId = JSON.parse(localStorage.profiles)[0]._id;

  return fetch("/api/notifications/subscribe", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, subscription })
  });
}

const convertedVapidKey = urlBase64ToUint8Array(
  "BBllMPpt4bWtP82cpfErhQbrC9Z-s8qZvi8DhVObOTgHFfpEfTUOTeO-0-qUrMWEwzT6rXxrUajDhb2IYc2Dmbc"
);

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
    //  console.log("register");
      if (!registration.pushManager) {
     //   console.log("Push manager unavailable.");
        return;
      }

      registration.pushManager
        .getSubscription()
        .then(function(existedSubscription) {
          if (existedSubscription === null) {
           // console.log("No subscription detected, make a request.");
            registration.pushManager
              .subscribe({
                applicationServerKey: convertedVapidKey,
                userVisibleOnly: true
              })
              .then(function(newSubscription) {
            //    console.log("New subscription added.");
                sendSubscription(newSubscription);
              })
              .catch(function(e) {
                if (Notification.permission !== "granted") {
              //    console.log("Permission was not granted.");
                } else {
                  console.error(
                    "An error ocurred during the subscription process.",
                    e
                  );
                }
              });
          } else {
        //    console.log("Existed subscription detected.");
            sendSubscription(existedSubscription);
          }
        });
    })
    .catch(error => {
      console.error("Error during service worker registration:", error);
    });
}

function checkValidServiceWorker(swUrl) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (
        response.status === 404 ||
        response.headers.get("content-type").indexOf("javascript") === -1
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
