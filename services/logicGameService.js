const { HttpError, getNextExplainer } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { getTeamById, getTeamByIdForRound } = require("./teamService");
const { isPlayerInGame } = require("./gameService");

// Checking that the team is not already on another team in this game
const isTeamExist = async (teamId) => {
  const team = await getTeamById(teamId);
  return team;
};

exports.joinTeam = async (teamId, userId) => {
  const team = await isTeamExist(teamId);

  if (!team) throw new HttpError(StatusCodes.NOT_FOUND, "Team is not exist");

  const gameId = team.game._id;

  // Checking that the player is not already on another team in this game
  const userExist = await isPlayerInGame(gameId, userId);

  if (userExist) {
    throw new HttpError(StatusCodes.CONFLICT, "Player already in another team");
  }

  team.player_list.push(userId);
  await team.save();

  return team;
};

exports.leftTeam = async (teamId, userId) => {
  const team = await getTeamById(teamId);
  team.player_list = team.player_list.filter((pl) => pl._id.toString() !== userId);
  console.log(team.player_list);
  await team.save();
  return team.populate("player_list");
};

exports.nextRound = async (teamId) => {
  const team = await getTeamByIdForRound(teamId);

  if (!Array.isArray(team.player_list) || team.player_list.length === 0) {
    throw new HttpError(StatusCodes.NOT_FOUND, "No players in team");
  }

  // newExplaner
  const nextExplaner = getNextExplainer(team.player_list, team.currentExplainer);

  //  Updating the current round  +1
  team.currentRound.number += 1;
  team.currentRound.isActive = true;

  team.currentExplainer = nextExplaner._id;

  await team.save();

  return team;
};
