export default ({ user, wsServer }) => (message) => {
  // On affiche le journal des messages côté serveur
  const now = new Date();
  const hour = `${now.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit" })}`;
  console.log(`${user.pseudo} à dit : ${message} à ${hour}`);

  // On envoi le message avec des infos supplémentaire pour avoir le contxte du côté des clients à
  // tous les autres utilisateurs
  // userSocket.broadcast.emit('userMessage', { user, hour, message });
  wsServer.emit("userMessage", { user, hour, message });
};
