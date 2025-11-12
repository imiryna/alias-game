const app = require("./app");
const mongoose = require("mongoose");

// Socket.io
const { createServer } = require("node:http");

const { initSocket } = require("./socketManager");
const { setupGameLoop } = require("./events/gameEmitter");

const httpServer = createServer(app);

initSocket(httpServer);

const PORT = process.env.PORT || 3000;
// const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongo:27017/${process.env.MONGO_DB}?authSource=admin`;
const mongoUrl = process.env.MONGO_URL;

async function startServer() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected successfully");

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    setupGameLoop();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

startServer();
