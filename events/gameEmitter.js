const EventEmitter = require("node:events");

const { TeamModel, UserModel } = require("../models");

// singleton instance
class GameEmitter extends EventEmitter {}
const gameEmitter = new GameEmitter();
const onlineUsers = new Map(); // userId -> socketId

exports.setupGameLoop = () => {
  gameEmitter.on("updateTeam", async ({ teamId, updateFields }) => {
    await TeamModel.updateOne({ _id: teamId }, { $set: updateFields });
  });

  gameEmitter.on("updateUser", async ({ userId, updateFields }) => {
    await UserModel.updateOne({ _id: userId }, { $set: updateFields });
  });

  gameEmitter.on("io:connect", ({ userId, socketId }) => onlineUsers.set(userId, socketId));
  gameEmitter.on("io:disconnect", ({ socketId }) => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socketId) {
        onlineUsers.delete(userId);
      }
    }
  });

  gameEmitter.on("chat:preCheck", async ({ teamId, newMessage }) => {
    const { checkingMessageFn } = require("../services");
    const messagePool = await checkingMessageFn({ teamId, newMessage });
    Object.keys(messagePool).forEach((ev) => {
      gameEmitter.emit(ev, messagePool[ev]);
    });
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
