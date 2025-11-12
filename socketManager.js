// socketManager.js
const { ChatModel } = require("./models");
const { leftTeam } = require("./services");
const { getGameEmitter, getOnlineUsers } = require("./events/gameEmitter");

let io;

function setupServer() {
  /*
   LOCAL EMITTER SECTION
  */
  let ge = getGameEmitter();
  ge.on("team:playerLeft", ({ teamId, userId }) => {
    if (!io) return;
    io.to(teamId).emit("userLeftTeam", { userId });
  });

  ge.on("team:roundEnded", ({ teamId, round }) => {
    if (!io) return;
    io.to(teamId).emit("roundEnded", { round, teamId });
  });

  ge.on("team:roundTimerTick", ({ teamId, remaining }) => {
    if (!io) return;
    io.to(teamId).emit("roundTimerTick", { remaining });
  });

  ge.on("chat:newPMMessage", ({ userId, message }) => {
    if (!io) return;
    io.to(getOnlineUsers()[userId]).emit("sysMessage", {
      text: message,
    });
  });

  ge.on("chat:sysMessage", ({ teamId, message }) => {
    if (!io) return;
    io.to(teamId).emit("sysMessage", { text: message });
  });

  ge.on("chat:newMessage", ({ teamId, message }) => {
    if (!io) return;
    io.to(teamId).emit("newMessage", message);
  });

  ge.on("chat:newExplainer", ({ teamId, explainer, word }) => {
    io.to(teamId).emit("sysMessage", { text: `[*] New Explainer is: ${explainer}` });
    io.to(explainer).emit("sysMessage", { text: `The word is =>> ${word}` });
  });

  ge.on("game:over", ({ teamId }) => {
    io.to(teamId).emit("sysMessage", { text: `The game is over` });

    const room = io.sockets.adapter.rooms.get(teamId);

    // Then disconnect all sockets in that room
    for (const socketId of room) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) socket.disconnect(true);
    }
  });

  /*
  IO SECTION
  */
  io.on("connection", (socket) => {
    console.log(`>>>>>>>>>>>> New connection: ${socket.id}`);

    // User joins a team chat room
    socket.on("joinTeam", async ({ userName, userId, teamId }) => {
      socket.join(teamId);
      ge.emit("io:connect", { userId, socketId: socket.id });
      socket.data.teamId = teamId;

      console.log(`>>>>>>>>>>>> User ${userName} joined team ${teamId}`);
      io.to(teamId).emit("userJoined", { userName, online: true });
    });

    // Receive a new message
    socket.on("sendMessage", async ({ teamId, userId, text }) => {
      const chat = await ChatModel.findOne({ team_id: teamId });
      if (!chat) return;

      let newMessage = {
        user: userId,
        text,
        timestamp: new Date(),
      };

      chat.messages.push(newMessage);
      let savedChat = await chat.save();

      // populate the last message's user
      savedChat = await savedChat.populate({
        path: "messages.user",
        match: { _id: userId },
        select: "name",
      });
      newMessage = savedChat.messages[savedChat.messages.length - 1];

      ge.emit("chat:preCheck", { teamId, userId, newMessage });
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      if (socket.data.teamId) {
        await leftTeam(socket.data.teamId, null, socket.id);
        ge.emit("io:disconnect", { socketId: socket.id });
      }
      console.log(">>>>>>>>>>>> Disconnection:", socket.id);
    });
  });
}

exports.initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: { origin: "*" },
  });
  setupServer();
  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
