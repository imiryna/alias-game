const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware");
const chatController = require("../controllers/chatController");

// GET /api/chat/team/:teamId - to get the history of messages for team
router.get("/team/:teamId", authMiddleware, chatController.getChatByTeam);

// POST /api/chat/team/:teamId - to create a chat for the team (for example, when the game starts)
router.post("/team/:teamId", authMiddleware, chatController.createChatForTeam);

module.exports = router;
