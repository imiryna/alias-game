const express = require("express");
const router = express.Router();

// const { authMiddleware } = require("../middleware");
const { createGame, getAllGames, getGameById } = require("../controllers");

router.post("/", createGame);
router.get("/", getAllGames);
router.get("/:id", getGameById);

module.exports = router;
