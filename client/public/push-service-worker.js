self.addEventListener("push", function(event) {
  event.waitUntil(
    registration.showNotification("Service worker", {
      body: "Push received"
    })
  );
});
