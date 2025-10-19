const { UserModel } = require("../models");
const { HttpError } = require("../utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { signToken, createUser } = require("./jwtService");
const { StatusCodes } = require("http-status-codes");

// helper for hashing
const hashPassword = (password) => {
  const salt = process.env.BCRYPT_SALT;
  return bcrypt.hashSync(password, salt);
};

exports.signup = async (data) => {
  const hash = hashPassword(data.password);

  const newUser = await createUser({
    name: data.username,
    email: data.email,
    password: hash,
  });

  const { accessToken, refreshToken } = signToken(newUser._id);
  newUser.token = accessToken;
  newUser.refreshToken = refreshToken;
  await newUser.save();

  newUser.password = undefined;

  return { user: newUser, accessToken, refreshToken };
};

//login
exports.login = async ({ email, password }) => {
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) throw new HttpError(StatusCodes.UNAUTHORIZED, "User not found");

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) throw new HttpError(StatusCodes.UNAUTHORIZED, "Wrong password");

  const { accessToken, refreshToken } = signToken(user._id);
  user.token = accessToken;
  user.refreshToken = refreshToken;
  await user.save();

  user.password = undefined;
  return user;
};

// refresh
exports.refresh = async (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await UserModel.findById(payload.id);
    if (!user || user.refreshToken !== token) throw new HttpError(StatusCodes.FORBIDDEN, "Invalid refresh token");

    const { accessToken, refreshToken } = signToken(user._id);
    user.token = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch{
    throw new HttpError(StatusCodes.FORBIDDEN, "Token expired or invalid");
  }
};
