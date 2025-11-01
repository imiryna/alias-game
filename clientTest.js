const { getIO } = require("../socketManager");

// the main emit for all game notifications 
exports.emitGameNotification = (gameId, message) => {
  const io = getIO();
  if (!io) {
    console.warn("Socket.io not initialized");
    return;
  }

  io.to(gameId).emit("gameNotification", { message });
  console.log(`Emit from clientTest.js → game ${gameId}: ${message}`);
};
