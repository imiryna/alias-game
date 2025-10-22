//const { authMiddleware } = require("../middleware");
const { getChatByTeam, createChatForTeam } = require("../controllers");
const express = require("express");
const router = express.Router();

// GET /api/chat/team/:teamId - to get the history of messages for team
router.get("/team/:teamId", getChatByTeam);

// POST /api/chat/team/:teamId - to create a chat for the team (for example, when the game starts)
router.post("/team/:teamId", createChatForTeam);

module.exports = router;
