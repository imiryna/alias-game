const express = require("express");
const router = express.Router();

const { protected } = require("../middlewares");
const { createGame, getAllGames, getGameById, startGame } = require("../controllers");

router.use(protected);

router.post("/", createGame);
router.get("/", getAllGames);
router.get("/:id", getGameById);
router.post("/startgame", startGame);

module.exports = router;
