const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware");
const teamController = require("../controllers/teamController");

router.post("/", authMiddleware, teamController.createTeam);
router.get("/", authMiddleware, teamController.getAllTeams);
router.get("/:id", authMiddleware, teamController.getTeamById);
router.patch("/:id", authMiddleware, teamController.updateTeam);
router.delete("/:id", authMiddleware, teamController.deleteTeam);

module.exports = router;
