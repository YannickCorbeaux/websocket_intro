const socket = io();
let pseudo;

socket.on("connect", () => {
  console.clear();
  console.log(`Bienvenue sur WebChat ${socket.id}`); // x8WIv7-mJelg7on_ALbx
  pseudo = socket.id;
});

socket.on("users", (users) => {
  console.log(`Il y a actuellement ${Object.values(users).length} utilisateurs connectés.`);
  console.log(`Liste des utilisateurs connectés : ${Object.values(users).map((user) => user.id)}`);
});

socket.on("userConnected", (user) => {
  console.log(`L'utilisatreur ${user.id} vient de se connecter`);
});

socket.on("userMessage", ({ message, user, hour }) => {
  console.log(`${user.pseudo} [${hour}] : ${message}`);
});

socket.on("pseudo", ({ oldPseudo, newPseudo, hour }) => {
  console.info(`${oldPseudo} [${hour}] : changement de pseudo (${newPseudo})`);
});

// Fonction permettant de mettre à jour son pseudo
function updatePseudo(input) {
  pseudo = input;
  socket.emit("userUpdate", { pseudo });
}

// Fonction qui devra être utiliser dans la console pour pouvoir commuiquer avec les personnes
// connectés
function chat(message) {
  // Du côté de l'utilisateur on se contente d'envoyer les message, car le serveur, sait qui a
  // envoyé ce message, et c'est le serveur qui se chargera de founbir des informations
  // supplémentaire comme l'heure du message par exemple.
  socket.emit("message", message);
}
