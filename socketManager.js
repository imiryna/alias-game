// socketManager.js
const { ChatModel, TeamModel } = require("./models");
const onlineUsers = new Map(); // userId -> socketId
const { leftTeam } = require("./services");

let io;

function setupSocket() {
  io.on("connection", (socket) => {
    console.log(`>>>>>>>>>>>> User connected: ${socket.id}`);

    // User joins a team chat room
    socket.on("joinTeam", async ({ userId, teamId }) => {
      socket.join(teamId);
      onlineUsers.set(userId, socket.id);
      socket.data.teamId = teamId;

      console.log(`>>>>>>>>>>>> User ${userId} joined team ${teamId}`);
      io.to(teamId).emit("userJoined", { userId, online: true });

      try {
        const chat = await ChatModel.findOne({ team_id: teamId })
            .populate("messages.user", "name");

        if (chat && chat.messages?.length) {
          socket.emit("chatHistory", chat.messages);
          console.log(`>>>>>>>>>>>> Sent chat history to user ${userId} (messages: ${chat.messages.length})`);
        } else {
          socket.emit("chatHistory", []);
          console.log(`>>>>>>>>>>>> No chat history for team ${teamId}`);
        }

      } catch (error) {
        console.error("Error sending chat history:", error);
      }
    });

    // Receive a new message
    socket.on("sendMessage", async ({ teamId, userId, text }) => {
      const chat = await ChatModel.findOne({ team_id: teamId });
      if (!chat) return;

      const team = await TeamModel.findById(teamId);
      if (!team) return;

      if (!team.currentRound?.is_active) {
        io.to(teamId).emit("systemMessage", {
          message: "Cannot send messages when the round is inactive.",
        });

        return;
      }

      const wordCount = text.trim().split(/\s+/).length;
      const isExplainer = String(userId) === String(team.currentExplainer);

      if (!isExplainer && wordCount > 1) {
        io.to(teamId).emit("systemMessage", {
          message: "Only the explainer can send messages with more than one word.",
        });

        return;
      }

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

      const newMsg = savedChat.messages[savedChat.messages.length - 1];
      io.to(teamId).emit("newMessage", newMsg);
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      for (const [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          io.emit("userOffline", { userId });
          if (socket.data.teamId) {
            await leftTeam(socket.data.teamId, userId);
          }

          break;
        }
      }
      console.log(">>>>>>>>>>>> User disconnected:", socket.id);
    });
  });
}

exports.initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: { origin: "*" },
  });
  setupSocket();
  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

exports.getOnlineUsers = () => {
  return onlineUsers;
};
