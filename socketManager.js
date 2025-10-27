// socketManager.js
const { ChatModel } = require("./models");
const onlineUsers = new Map(); // userId -> socketId

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log(`>>>>>>>>>>>> User connected: ${socket.id}`);

    // User joins a team chat room
    socket.on("joinTeam", ({ userId, teamId }) => {
      socket.join(teamId);
      onlineUsers.set(userId, socket.id);

      console.log(`>>>>>>>>>>>> User ${userId} joined team ${teamId}`);
      io.to(teamId).emit("userJoined", { userId, online: true });
    });

    // Receive a new message
    socket.on("sendMessage", async ({ teamId, userId, text }) => {
      const chat = await ChatModel.findOne({ team_id: teamId });
      if (!chat) return;

      const newMessage = {
        user: userId,
        text,
        timestamp: new Date(),
      };

      chat.messages.push(newMessage);
      await chat.save();

      io.to(teamId).emit("newMessage", newMessage);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      for (const [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          io.emit("userOffline", { userId });
          break;
        }
      }
      console.log(">>>>>>>>>>>> User disconnected:", socket.id);
    });
  });
}

module.exports = { setupSocket };
