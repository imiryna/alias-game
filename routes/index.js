const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes.js");
const gameRoutes = require("./gameRoutes.js");
const teamRoutes = require("./teamRoutes.js");
const chatRoutes = require("./chatRoutes.js");

router.use("/user", userRoutes);
router.use("/game", gameRoutes);
router.use("/team", teamRoutes);
router.use("/chat", chatRoutes);

module.exports = router;
