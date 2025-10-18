const express = require("express");
const router = express.Router();

const { 
    createTeam,
    getAllTeams, 
    getTeamById, 
    updateTeam, 
    deleteTeam,
 } = require("../controllers/teamController");

// const { authMiddleware } = require("../middlewares");

router.post("/", createTeam);
router.get("/", getAllTeams);
router.get("/:id", getTeamById);
router.patch("/:id", updateTeam);
router.delete("/:id", deleteTeam);

module.exports = router;
