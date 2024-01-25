// Si on branche un écouteur sur le socket de l'utilisateur, on écoutera un évenement de CET
// utilisateur et pas un évenement global.
export default ({ userSocket, users }) => (reason) => {
  console.log(`l'utilisateur ${userSocket.id} vient de se déconnecter`);
  console.log(reason);
  delete users[userSocket.id];
  console.log(`${Object.values(users).length} utilisateurs connectés`);
};
