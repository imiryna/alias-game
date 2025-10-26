//const { authMiddleware } = require("../middleware");
const { getChatByTeam, createChatForTeam, sendMessageToTeam } = require("../controllers");
const express = require("express");
const router = express.Router();
const { protected } = require("../middlewares");

// GET /api/chat/team/:teamId - to get the history of messages for team
router.get("/:teamId", getChatByTeam);
router.post("/send", protected, sendMessageToTeam);
// POST /api/chat/team/:teamId - to create a chat for the team (for example, when the game starts)
router.post("/:teamId", createChatForTeam);

module.exports = router;
