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
