const TeamModel = require("../models/teamModel");
const { catchAsync, HttpError } = require("../utils");

// to create a new team
exports.createTeam = catchAsync(async (req, res) => {
  const { name, player_list } = req.body;

  if (!name) {
    throw new HttpError(400, "Team name is required");
  }

  const newTeam = await TeamModel.create({
    name,
    player_list: player_list || [],
  });

  res.status(201).json({
    message: "Team created successfully",
    team: newTeam,
  });
});

// to get all teams
exports.getAllTeams = catchAsync(async (_req, res) => {
  const teams = await TeamModel.find().populate("player_list", "username email");
  res.status(200).json(teams);
});

// to get a team by id  
exports.getTeamById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const team = await TeamModel.findById(id).populate("player_list", "username email");

  if (!team) {
    throw new HttpError(404, "Team not found");
  }

  res.status(200).json(team);
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
    throw new HttpError(404, "Team not found");
  }

  res.status(200).json({
    message: "Team updated successfully",
    team: updatedTeam,
  });
});

// to delete a team
exports.deleteTeam = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedTeam = await TeamModel.findByIdAndDelete(id);

  if (!deletedTeam) {
    throw new HttpError(404, "Team not found");
  }

  res.status(200).json({
    message: "Team deleted successfully",
    team: deletedTeam,
  });
});
