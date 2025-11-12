const { createTeamIdValidator } = require("./validateGame");
const { HttpError, catchAsync } = require("../helpers");
const { StatusCodes } = require("http-status-codes");

exports.validateTeamId = catchAsync(async (req, res, next) => {
  const { error } = createTeamIdValidator(req.params);
  if (error) throw new HttpError(StatusCodes.BAD_REQUEST, error.details[0].message);
  next();
});
