const { StatusCodes } = require("http-status-codes");
const { UserModel } = require("../models");
const { HttpError } = require("../utils");

// to get all users list
exports.getAllUsers = async () => {
  return await UserModel.find({}, "-passwordHash").lean();
};

// to get a user by id
exports.getUserById = async (id) => {
  const user = await UserModel.findById(id, "-passwordHash").lean();
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
  return user;
};

exports.createUser = async (data) => {
  const newUser = await UserModel.create(data);

  return newUser;
};

// to update user stats
exports.updateUserStats = async (id, statsData) => {
  const { gamesPlayed, wins } = statsData;

  const user = await UserModel.findById(id);
  if (!user) {
    return null;
  }

  // Update stats fields only
  if (gamesPlayed !== undefined) user.stats.gamesPlayed = gamesPlayed;
  if (wins !== undefined) user.stats.wins = wins;

  await user.save();
  return user.stats;
};

// to delete a user
exports.deleteUser = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};

exports.checkUserExists = async (filter) => {
  const userExist = await UserModel.exists(filter);

  if (userExist) throw new HttpError(StatusCodes.CONFLICT, "Email in use");
};
