const { checkUserExists, checkToken, getUserById } = require("../services");
const { catchAsync, HttpError } = require("../helpers");
const { signupAuthDataValidator, loginAuthDataValidator } = require("./validateAuth");
const { StatusCodes } = require("http-status-codes");

exports.checkSignupData = catchAsync(async (req, _, next) => {
  const { value, error } = signupAuthDataValidator(req.body);

  if (error) {
    throw new HttpError(StatusCodes.BAD_REQUEST, "Invalid user data..", error);
  }

  const existingUser = await checkUserExists({ email: value.email });
  if (existingUser) throw new HttpError(StatusCodes.CONFLICT, "User already exists");

  req.body = value;

  next();
});

exports.checkLoginData = catchAsync(async (req, _, next) => {
  const { value, error } = loginAuthDataValidator(req.body);

  if (error) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, "Not authrized..", error);
  }

  req.body = value;

  next();
});

exports.protected = catchAsync(async (req, _, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, "No token provided");
  }

  const token = authHeader.split(" ")[1];
  const userId = checkToken(token);

  const user = await getUserById(userId);
  if (!user) throw new HttpError(StatusCodes.UNAUTHORIZED, "User not found");

  req.user = user;
  next();
});
