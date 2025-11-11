const EventEmitter = require("node:events");

const { TeamModel, UserModel } = require("../models");
const { checkingMessageFn } = require("../utils/");

// singleton instance
class GameEmitter extends EventEmitter {}
const gameEmitter = new GameEmitter();
const onlineUsers = new Map(); // userId -> socketId

exports.setupGameLoop = () => {
  gameEmitter.on("updateTeam", async ({ teamId, updateFields }) => {
    await TeamModel.updateOne({ _id: teamId }, updateFields);
  });

  // TODO
  gameEmitter.on("userUpdate", async ({ userId, updateFields }) => {
    UserModel.updateOne({ _id: userId }, { $set: updateFields });
  });

  gameEmitter.on("io:connect", ({ userId, socketId }) => onlineUsers.set(userId, socketId));
  gameEmitter.on("io:disconnect", ({ socketId }) => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socketId) {
        onlineUsers.delete(userId);
      }
    }
  });

  gameEmitter.on("chat:preCheck", async ({ teamId, userId, newMessage }) => {
    const result = await checkingMessageFn({ teamId, userId, newMessage });
    newMessage.text = result;
    gameEmitter.emit("chat:newMessage", { teamId, userId, newMessage }); //
  });
};

exports.getGameEmitter = () => {
  if (!gameEmitter) {
    throw new Error("Emmiter not initialized");
  }
  return gameEmitter;
};

exports.getOnlineUsers = () => {
  return onlineUsers;
};
