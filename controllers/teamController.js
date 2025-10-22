const teamService = require("../services/teamService");
const { catchAsync } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { getTeamById } = require("../services");

exports.createTeam = catchAsync(async (req, res) => {
  const { name, player_list } = req.body;
  const newTeam = await teamService.createTeam({ name, player_list });

  res.status(StatusCodes.CREATED).json({
    message: "Team created successfully",
    team: newTeam,
  });
});

exports.getAllTeams = catchAsync(async (_req, res) => {
  const teams = await teamService.getAllTeams();
  res.status(StatusCodes.OK).json(teams);
});

// to get a team by id
exports.getTeamById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const team = await getTeamById(id);

  res.status(StatusCodes.OK).json({
    message: "Success",
    team,
  });
});

exports.updateTeam = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedTeam = await teamService.updateTeam(id, req.body);

  res.status(StatusCodes.OK).json({
    message: "Team updated successfully",
    team: updatedTeam,
  });
});

exports.deleteTeam = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedTeam = await teamService.deleteTeam(id);

  res.status(StatusCodes.OK).json({
    message: "Team deleted successfully",
    team: deletedTeam,
  });
});

exports.chooseNextExplainer = catchAsync(async (req, res) => {
  const { teamId } = req.params;
  const team = await teamService.chooseNextExplainer(teamId);

  res.status(StatusCodes.OK).json({
    message: "Next explainer chosen",
    team,
  });
});
