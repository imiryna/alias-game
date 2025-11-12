const { getAllTeams, deleteTeam } = require("../services");
const { catchAsync } = require("../helpers");
const { StatusCodes } = require("http-status-codes");
const { getTeamById } = require("../services");

exports.getAllTeams = catchAsync(async (_req, res) => {
  const teams = await getAllTeams();
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

exports.deleteTeam = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedTeam = await deleteTeam(id);

  res.status(StatusCodes.OK).json({
    message: "Team deleted successfully",
    team: deletedTeam,
  });
});
