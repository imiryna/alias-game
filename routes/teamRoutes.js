const express = require("express");
const router = express.Router();

const { getTeamById, deleteTeam, joinTheTeam, leftTheTeam, nextTeamRound } = require("../controllers");
const { protected, validateTeamId } = require("../middlewares");

router.use(protected);

router.get("/:id", getTeamById);
router.delete("/:id", deleteTeam);

// Logic game routers

router.post("/:teamId/join", validateTeamId, joinTheTeam);
router.post("/:teamId/leave", validateTeamId, leftTheTeam);
router.post("/:teamId/next-round", validateTeamId, nextTeamRound); // only for testing purpose

module.exports = router;
