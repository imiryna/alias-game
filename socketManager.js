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
