const { HttpError, getNextExplainer } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { getTeamById } = require("./teamService");

// Checking that the team is not already on another team in this game
const isTeamExist = async (teamId) => {
  const team = await getTeamById(teamId);
  return team;
};

exports.joinTeam = async (teamId, userId) => {
  const team = await isTeamExist(teamId);

  if (!team) throw new HttpError(StatusCodes.NOT_FOUND, "Team is not exist");

  // Checking that the player is not already on another team in this game
  const userExist = await getTeamById({
    game: team.game._id,
    players: userId,
  });

  if (userExist.id !== teamId) {
    throw new HttpError(StatusCodes.CONFLICT, "Player already in another team");
  }

  team.players.push(userId);
  await team.save();

  return team;
};

exports.leftTeam = async (teamId, userId) => {
  const team = await getTeamById(teamId);

  // Checking is there a player in the team
  if (team.players.includes(userId)) {
    team.players.filter((pl) => pl.toString() !== userId.toString());
  }

  await team.save();
  return team.populate("players");
};

exports.nextRound = async (teamId) => {
  const team = await getTeamById(teamId);

  if (!Array.isArray(team.players) || team.players.length === 0) {
    throw new HttpError(StatusCodes.NOT_FOUND, "No players in team");
  }

  // newExplaner
  const nextExplaner = getNextExplainer(team.players, team.currentExplainer);

  //  Updating the current round  +1
  team.currentRound.number += 1;
  team.currentRound.isActive = true;

  team.currentRound.activeTeam = team._id;
  team.currentExplainer = nextExplaner._id || nextExplaner.Plainer;

  await team.save();

  return team;
};
