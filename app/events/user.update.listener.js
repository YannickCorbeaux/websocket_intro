export default ({ userSocket, user }) => (infos) => {
  console.log(`${user.pseudo} a mis à jour ses infos : `);

  // Si jamais un utilsateur change de pseudo on en informe tous les autres utilisateurs
  if (infos.pseudo !== user.pseudo) {
    // On affiche le journal des messages côté serveur
    const now = new Date();
    const hour = `${now.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit" })}`;
    userSocket.broadcast.emit("pseudo", { oldPseudo: user.pseudo, newPseudo: infos.pseudo, hour });
  }
  Object.entries(infos).forEach(([key, value]) => {
    console.log(`${key} : ${value}`);
    user[key] = value;
  });
};
