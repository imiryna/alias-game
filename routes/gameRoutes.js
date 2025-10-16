const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware");
const gameController = require("../controllers/gameController");

router.post("/", authMiddleware, gameController.createGame);
router.get("/", authMiddleware, gameController.getAllGames);
router.get("/:id", authMiddleware, gameController.getGameById);
router.patch("/:id", authMiddleware, gameController.updateGame);
router.delete("/:id", authMiddleware, gameController.deleteGame);

module.exports = router;
