const TeamModel = require("../models/teamModel");
const { catchAsync, HttpError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

// to create a new team
exports.createTeam = catchAsync(async (req, res) => {
  const { name, player_list } = req.body;

  if (!name) {
    throw new HttpError(StatusCodes.BAD_REQUEST, "Team name is required");
  }

  const newTeam = await TeamModel.create({
    name,
    player_list: player_list || [],
  });

  res.status(StatusCodes.CREATED).json({
    message: "Team created successfully",
    team: newTeam,
  });
});

// to get all teams
exports.getAllTeams = catchAsync(async (_req, res) => {
  const teams = await TeamModel.find().populate("player_list", "username email");
  res.status(StatusCodes.OK).json(teams);
});

// to get a team by id  
exports.getTeamById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const team = await TeamModel.findById(id).populate("player_list", "username email");

  if (!team) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Team not found");
  }

  res.status(StatusCodes.OK).json(team);
});

// to update a team
exports.updateTeam = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedTeam = await TeamModel.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate("player_list", "username email");

  if (!updatedTeam) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Team not found");
  }

  res.status(StatusCodes.OK).json({
    message: "Team updated successfully",
    team: updatedTeam,
  });
});

// to delete a team
exports.deleteTeam = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedTeam = await TeamModel.findByIdAndDelete(id);

  if (!deletedTeam) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Team not found");
  }

  res.status(StatusCodes.OK).json({
    message: "Team deleted successfully",
    team: deletedTeam,
  });
});
