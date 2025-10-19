const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const teamRoutes = require("./routes/teamRoutes");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
//const routerApi = require("./routes/index.js");

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

//app.use("/api", routerApi);
app.use("/api/user", userRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

app.get("/help", (req, res) => {
  return res.status(200).json({ message: "hello" });
});

// Routes
// app.use("/api/users", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res) => {
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
