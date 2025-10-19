const { checkUserExists, checkToken, getUserById } = require("../services");
const { catchAsync, HttpError } = require("../utils");
const { signupAuthDataValidator } = require("./validateAuth");

exports.checkSignupData = catchAsync(async (req, _, next) => {
  const { value, error } = signupAuthDataValidator(req.body);

  if (error) {
    throw new HttpError(400, "Invalid user data..", error);
  }

  const existingUser = await checkUserExists({ email: value.email });
  if (existingUser) throw new HttpError(409, "User already exists");

  req.body = value;

  next();
});

exports.checkLoginData = catchAsync(async (req, _, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "No token provided");
  }

  const token = authHeader.split(" ")[1];
  const userId = checkToken(token);

  const user = await getUserById(userId);
  if (!user) throw new HttpError(401, "User not found");

  req.user = user;
  next();
});
