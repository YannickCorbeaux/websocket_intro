import userUpdateListener from "./user.update.listener.js";
import messageListener from "./message.listener.js";
import disconnectListener from "./disconnect.listener.js";

export default (context) => {
  context.userSocket.on("disconnect", disconnectListener(context));
  context.userSocket.on("message", messageListener(context));
  context.userSocket.on("userUpdate", userUpdateListener(context));
};
