const { HttpError } = require("../utils");
const { Team } = require("../models");
const { StatusCodes } = require("http-status-codes");

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

exports.getTeamById = async (teamId) => {
  const team = await Team.findById(teamId).populate("player_list", "username email");

  if (!team) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Team not found");
  }
  return team;
};
