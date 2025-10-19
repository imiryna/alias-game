const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const teamRoutes = require("./routes/teamRoutes");
const chatRoutes = require("./routes/chatRoutes");
// const mongoose = require("mongoose");

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

//app.use("/api", routerApi);
app.use("/api/user", userRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/chat", chatRoutes);

// app.use("/api", routerApi);

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res) => {
  res.status(err.status).json({ message: err.message });
});

module.exports = app;
