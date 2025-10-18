const express = require("express");
const router = express.Router();

//const { authMiddleware } = require("../middleware");
const {
    createGame,
    getAllGames,
    getGameById,
    updateGame,
    deleteGame,
} = require("../controllers/gameController");

router.post("/", createGame);
router.get("/", getAllGames);
router.get("/:id", getGameById);
router.patch("/:id", updateGame);
router.delete("/:id", deleteGame);

module.exports = router;
