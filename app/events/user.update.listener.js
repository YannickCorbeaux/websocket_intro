export default ({ userSocket, user }) => (infos) => {
  console.log(`${user.pseudo} a mis à jour ses infos : `);

  Object.entries(infos).forEach(([key, value]) => {
    console.log(`${key} :`, value);
    user[key] = value;
  });

  // Si jamais un utilsateur change de pseudo on en informe tous les autres utilisateurs
  if (infos.pseudo !== user.pseudo) {
    // On affiche le journal des messages côté serveur
    const now = new Date();
    const hour = `${now.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit" })}`;
    userSocket.broadcast.emit("pseudo", { oldPseudo: user.pseudo, newPseudo: infos.pseudo, hour });
  }

  // On vérifie que des infos d'avatar on été envoyés
  if (infos.avatar) {
    userSocket.broadcast.emit("avatar", user);
  }
};
