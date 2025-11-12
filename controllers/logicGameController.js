const { catchAsync } = require("../helpers");
const { StatusCodes } = require("http-status-codes");
const { joinTeam, leftTeam, nextRound } = require("../services");

exports.joinTheTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;
  const userId = req.user.id;

  const team = await joinTeam(teamId, userId);

  res.status(StatusCodes.OK).json({
    message: "Success",
    team,
  });
});

exports.leftTheTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;
  const userId = req.user.id;

  const team = await leftTeam(teamId, userId);

  res.status(StatusCodes.OK).json({
    message: "Success",
    team,
  });
});

exports.nextTeamRound = catchAsync(async (req, res) => {
  const { teamId } = req.params;

  const team = await nextRound(teamId);

  res.status(StatusCodes.OK).json({
    message: "Success",
    team,
  });
});
