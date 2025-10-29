const { HttpError } = require("../utils");
const { TeamModel } = require("../models");
const { StatusCodes } = require("http-status-codes");
const { generateSlug } = require("random-word-slugs");

// to create a new team
exports.createTeam = async (teamData = { name: null, player_list: [] }) => {
  let { name, player_list } = teamData;

  if (!name)
    name = generateSlug()
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");

  const newTeam = await TeamModel.create({
    name,
    player_list,
  });

  return newTeam;
};

exports.getTeamById = async (teamId) => {
  const team = await TeamModel.findById(teamId).populate("player_list", "username email").populate("game");

  if (!team) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Team not found");
  }
  return team;
};

exports.getTeamByIdForRound = async (teamId) => {
  const team = await TeamModel.findById(teamId); //.populate("currentExplainer").populate("currentRound").populate("player_list");

  if (!team) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Team not found");
  }
  return team;
};
