const { catchAsync } = require("../helpers");
const { signup, login, refresh } = require("../services");
const { StatusCodes } = require("http-status-codes");

exports.signup = catchAsync(async (req, res) => {
  const user = await signup(req.body);
  res.status(StatusCodes.CREATED).json({
    message: "Success",
    user,
  });
});

exports.login = catchAsync(async (req, res) => {
  const user = await login(req.body);

  return res.status(StatusCodes.CREATED).json({
    message: "Success",
    user,
  });
});

exports.refresh = catchAsync(async (req, res) => {
  const { token } = req.body;
  const { accessToken, refreshToken } = await refresh(token);
  res.status(StatusCodes.OK).json({
    message: "Token refreshed",
    accessToken,
    refreshToken,
  });
});
