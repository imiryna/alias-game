const { catchAsync } = require("../utils");
const { signup } = require("../services");

exports.signup = catchAsync(async (req, res) => {
  const { user, token } = await signup(req.body);
  res.status(201).json({
    message: "Success",
    user,
    token,
  });
});
// exports.login = async (req, res, next) => {};
//   res.status(201).json({
//     message: "Success",
//     user,
//     token,
//   });

// exports.login = async (req, res, next) => {};
