// public key BPAsCrULaue3t97f7sXKOXyr0lFN18_yd-AnN-d8u5ua-DjimumBwrSf38BL2x-kVbg9RgvjI-GnejXHQY8ejM0

self.addEventListener("push", function(event) {
  if (!(self.Notification && self.Notification.permission === "granted")) {
    return;
  }

  var data = {};
  if (event.data) {
    data = event.data.json();
  }
  var title = data.title;
  var message = data.message;
  var id = data.id;
  var icon = "img/FM_logo_2013.png";

  self.clickTarget = data.clickTarget;

  event.waitUntil(
    self.registration.showNotification(title, {
      body: message,
      tag: "push-demo",
      icon: icon,
      badge: icon,
      data
    })
  );
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();

  if (clients.openWindow) {
    // console.log(event.notification.data.id);
    if (event.notification.title === "Objective") {
      event.waitUntil(
        clients.openWindow(`/Objectives/Edit/${event.notification.data.id}`)
      );
    }
    if (event.notification.title === "Meeting") {
      event.waitUntil(
        clients.openWindow(`/Meetings/${event.notification.data.id}`)
      );
    }
  }
});

const CACHE_NAME = "my-site-cache-v1";
