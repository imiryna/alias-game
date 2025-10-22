const app = require("./app");
const mongoose = require("mongoose");

// Socket.io
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const { setupSocket } = require("./socketManager");

const { initChatSocket } = require("./services");

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

setupSocket(io);
initChatSocket(io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.emit("message", "User connected!");

  socket.on("disconnect", () => {
    console.log("User:", socket.id);
    socket.emit("message", "User disconnected!");
  });
});

const PORT = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL_LOCAL;

async function startServer() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected successfully");

    module.exports = httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

startServer();
