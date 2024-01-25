import { createServer as createHttpServer } from "node:http";
import { Server as WsServer } from "socket.io";
import "./app/helpers/env.load.js";
import app from "./app/index.app.js";

import listeners from "./app/events/index.listener.js";

const PORT = process.env.PORT || 3000;

const httpServer = createHttpServer(app);
const wsServer = new WsServer(httpServer);

// On initialise une collection d'utilisateurs afin de pouvoir, le compter, les gérer, etc…
const users = {};

// Evenement principal un utilisateur se connecte au server WebSocket
wsServer.on("connection", (userSocket) => {
  // dans userSocket on récupère un objet qui représente la connection utilisateur
  // Dans cet objet on a un identifiant permettant de savoir avec qui on échange.
  console.log(`l'utilisateur ${userSocket.id} vient de se connecter`);
  // On ajoute l'utilisateur à notre collection
  const user = {
    id: userSocket.id,
    pseudo: userSocket.id,
  };
  users[userSocket.id] = user;

  console.log(`${Object.values(users).length} utilisateurs connectés`);

  // On communique à l'utilisateur qui vient de se connecter la liste des utilisateur actuellement
  // connectés au serveur.
  // ! Attention ici on ne communique QUE avec l'utilisateur courant
  userSocket.emit("users", users);
  // Si on veut communiquer à tout les utilisteur AUTRE que l'utilisateur qui vient de se connecter
  userSocket.broadcast.emit("userConnected", user);
  userSocket.broadcast.emit("users", users);

  listeners({
    userSocket,
    user,
    users,
    wsServer,
  });
});

httpServer.listen(3000, () => {
  console.log(`Server launched on port ${PORT}`);
});
