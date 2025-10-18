const { getNextExplainer, HttpError } = require("../utils");
const { Team } = require("../models");
const { StatusCodes } = require("http-status-codes");

/**
 * Chooses the next explainer for the team using round-robin selection.
 *
 * * @param {string} teamId
 *  * @returns {Promise<*>}
 */
exports.chooseNextExplainer = async (teamId) => {
  const team = await Team.findById(teamId).populate("player_list");
  if (!team) throw new HttpError(StatusCodes.NOT_FOUND, "Team not found");

  const { nextExplainer, nextIndex } = getNextExplainer(team.player_list, team.currentExplainerIndex);

  team.currentExplainer = nextExplainer._id;
  team.currentExplainerIndex = nextIndex;

  await team.save();
  return team;
};


// to create a new team
exports.createTeam = async (teamData) => {
  const { name, player_list = [] } = teamData;

  if (!name) throw new HttpError(StatusCodes.BAD_REQUEST, "Team name is required");

  const newTeam = await Team.create({
    name,
    player_list,
  });

  return newTeam;
};
