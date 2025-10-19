const { catchAsync } = require("../utils");
const { signup, login, refresh } = require("../services");

exports.signup = catchAsync(async (req, res) => {
  const user = await signup(req.body);
  res.status(201).json({
    message: "Success",
    user,
  });
});

exports.login = catchAsync(async (req, res) => {
  const user = await login(req.body);

  return res.status(201).json({
    message: "Success",
    user,
  });
});

exports.refresh = catchAsync(async (req, res) => {
  const { token } = req.body;
  const { accessToken, refreshToken } = await refresh(token);
  res.status(200).json({
    message: "Token refreshed",
    accessToken,
    refreshToken,
  });
});
