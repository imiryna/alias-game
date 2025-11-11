//const { authMiddleware } = require("../middleware");
const { getChatByTeam, createChatForTeam, sendMessageToTeam } = require("../controllers");
const express = require("express");
const router = express.Router();
const { protected } = require("../middlewares");

router.use(protected);

// to get the history of messages for team
router.get("/:teamId", getChatByTeam);
router.post("/send", sendMessageToTeam);

// to create a chat for the team (for example, when the game starts)
router.post("/:teamId", createChatForTeam);

module.exports = router;
