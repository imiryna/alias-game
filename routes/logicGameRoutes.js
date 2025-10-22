const express = require("express");
const router = express.Router();
// const { checkSignupData } = require("../middlewares");
const { joinTheTeam, leftTheTeam, nextTeamRound } = require("../controllers");
const { validateTeamId } = require("../middlewares");
const { protected } = require("../middlewares");

router.use(protected);

router.post("/:teamId/join", validateTeamId, joinTheTeam);
router.post("/:teamId/leave", validateTeamId, leftTheTeam);
router.post("/:teamId/next-round", validateTeamId, nextTeamRound);

module.exports = router;
