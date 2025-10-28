const express = require("express");
const router = express.Router();

// const { authMiddleware } = require("../middleware");
const { createGame, getAllGames, getGameById, endGame } = require("../controllers");

router.post("/", createGame);
router.get("/", getAllGames);
router.get("/:id", getGameById);
router.post("/:id/end", endGame);

module.exports = router;
