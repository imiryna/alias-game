const app = require("./app");
const mongoose = require("mongoose");

// Socket.io

const { createServer } = require("node:http");
const { Server } = require("socket.io");
// const { Message } = require("./models");

const httpServer = createServer(app);
const { setupSocket } = require("./socketManager");

const { initChatSocket } = require("./services");

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  // cors: {
  //   pingInterval: 10000,
  //   pingTimeout: 5000,
  // },
});

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);
//   socket.emit("message", `User ${socket.id} connected!`);

//   socket.on("disconnect", () => {
//     console.log("User:", socket.id);
//     socket.emit("message", `User ${socket.id} disconnected!`);
//   });
// });

// io.emit("message", "Hello everyone, I'm, server");

// app.post("/messages", async (req, res) => {
//   const message = await Message.create(req.body);

//   io.emit("newMessage", message);

//   res.json(message);
// });

setupSocket(io);
initChatSocket(io);

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
