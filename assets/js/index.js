const socket = io();

function getRandomIntInclusive(min, max) {
  const roundedMin = Math.ceil(min);
  const roundedMax = Math.floor(max);
  return Math.floor(Math.random() * (roundedMax - roundedMin + 1) + roundedMin);
}

const app = {

  stageConfig: {
    width: 1024,
    height: 576,
  },

  users: {
    avatar: {},
  },

  init() {
    console.log("app.init");
    app.stage = new createjs.Stage("board");
    app.me = { avatar: { x: 0, y: 0, character: null } };
    app.addWsListener();
  },

  createAvatar(user) {
    console.log("createAvatar", user);
    let target = app.me;
    if (user) {
      target = user;
    }
    target.avatar.character = new createjs.Shape();
    target.avatar.character.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    if (!user) {
      // On determine la position de début de manière aléatoire
      target.avatar.x = getRandomIntInclusive(0, app.stageConfig.width);
      target.avatar.y = getRandomIntInclusive(0, app.stageConfig.height);
    }
    target.avatar.character.x = target.avatar.x;
    target.avatar.character.y = target.avatar.y;
    app.stage.addChild(target.avatar.character);
    app.stage.update();
    console.log(target);
  },

  addWsListener() {
    console.log("addWsListener");
    socket.on("connect", () => {
      console.clear();
      console.log(`Bienvenue sur WebChat ${socket.id}`); // x8WIv7-mJelg7on_ALbx
      app.me.id = socket.id;
      app.me.pseudo = socket.id;
      app.users[socket.id] = app.me;
      app.createAvatar();
      socket.emit("userUpdate", { avatar: { x: app.me.avatar.x, y: app.me.avatar.y } });
    });

    socket.on("users", (users) => {
      app.users = users;
      const usersTab = Object.entries(app.users);
      const otherTupleUsers = usersTab.filter(([id]) => {
        console.log("test", id, app.me.id);
        return id !== app.me.id;
      });
      const otherUsers = otherTupleUsers.map(([, user]) => user);
      otherUsers.forEach((user) => {
        console.log("users event :", user);
        user.avatar = { x: 0, y: 0, character: null };
        app.createAvatar(user);
      });
      const usersCollection = Object.values(users);
      console.log(`Il y a actuellement ${usersCollection.length} utilisateurs connectés.`);
      console.log(`Liste des utilisateurs connectés : ${usersCollection.map((user) => user.id)}`);
    });

    // Quand un autre utilisateur se connecte
    socket.on("userConnected", (user) => {
      console.log(`L'utilisateur ${user.id} vient de se connecter`);
      app.users[user.id] = user;
    });

    socket.on("userMessage", ({ message, user, hour }) => {
      console.log(`${user.pseudo} [${hour}] : ${message}`);
    });

    socket.on("pseudo", ({ oldPseudo, newPseudo, hour }) => {
      console.info(`${oldPseudo} [${hour}] : changement de pseudo (${newPseudo})`);
    });

    socket.on("avatar", ({ id, avatar }) => {
      console.info(`L'utilisateur ${id} a mis à jour son avatar`);
      console.log(avatar);
      if (!app.users[id].avatar) {
        app.users[id].avatar = avatar;
        app.users[id].avatar.character = null;
        app.createAvatar(app.users[id]);
      }
      // représentation visuel de l'avatar
      app.users[id].avatar.character.x = avatar.x;
      app.users[id].avatar.character.y = avatar.y;
      console.log(app.users[id]);
    });
  },

  // Fonction permettant de mettre à jour son pseudo
  updatePseudo(pseudo) {
    console.log("updatePseudo");
    app.me.pseudo = pseudo;
    socket.emit("userUpdate", { pseudo });
  },

  // Fonction qui devra être utiliser dans la console pour pouvoir commuiquer avec les personnes
  // connectés
  chat(message) {
    console.log("chat");
    // Du côté de l'utilisateur on se contente d'envoyer les message, car le serveur, sait qui a
    // envoyé ce message, et c'est le serveur qui se chargera de founbir des informations
    // supplémentaire comme l'heure du message par exemple.
    socket.emit("message", message);
  },
};

document.addEventListener("DOMContentLoaded", app.init);
