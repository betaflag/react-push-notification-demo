This is a simple Push Notification demo using NodeJS and React

## Server

The server uses (Express)[https://expressjs.com/] and (web-push)[https://www.npmjs.com/search?q=web%2Dpush] libraries.

To configure the server, you need to run `npx web-push generate-vapid-keys` and add the keys to `/server/.env.local`.

```sh
VAPID_PUBLIC=<vapid public key>
VAPID_PRIVATE=<vapid private key>
```

Note: The server saves the browser subscriptions in memory based on a very naive identification process. While it makes this demo simpler, it's not suitable for a real application.

### Running the server

```
cd server
npm install
npm start
```

## Client

The client demonstrate how to receive push notification in a (Create-React-App)[https://github.com/facebook/create-react-app] application.

```
cd client
npm install
npm start
```
