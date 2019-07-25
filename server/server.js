/**
 * A small Push Server to send notification to web browsers
 *
 * You'll need to get VAPID keys to configure the WebPush library:
 * `npx web-push generate-vapid-keys` (details https://www.npmjs.com/package/web-push)
 *
 * It subscribes each browsers in memory using the naive `browserId` method for simplicity purpose.
 * You should make sure to persist subscription of your user in a less naive way for a real application.
 */

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const webPush = require("web-push");
require("dotenv").config();

const PORT = 4000;

// Configure the webPush API with VAPID keys
webPush.setVapidDetails(
  `http://locahost:${PORT}`,
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

/**
 * Returns a naive browser ID based on the request.
 *
 * @param {Request} req
 */
function browserId(req) {
  return req.connection.remoteAddress + req.get("User-Agent");
}

const app = express();

app.use(cors()); // Needed if the client app runs on a different host or port
app.use(bodyParser.json());

let subscriptions = {};

// Endpoint to register a new browser
app.post("/register", function(req, res) {
  subscriptions[browserId(req)] = req.body.subscription;
  res.sendStatus(200);
});

// Endpoint to send a push notification the calling browser
app.get("/notify", (req, res) => {
  const subscription = subscriptions[browserId(req)];
  webPush
    .sendNotification(subscription, "hello")
    .then(() => res.sendStatus(200))
    .catch(error => res.status(500).send(error));
});

// Endpoint to get the public VAPID key
app.get("/vapidPublicKey", (_, res) => {
  res.send(process.env.VAPID_PUBLIC);
});

app.listen(PORT, () =>
  console.log(`Push server ready at http://localhost:${PORT}`)
);
