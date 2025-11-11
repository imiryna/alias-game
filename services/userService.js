const { StatusCodes } = require("http-status-codes");
const { UserModel } = require("../models");
const { HttpError } = require("../utils");
const { getGameEmitter } = require("../events/gameEmitter");

exports.getAllUsers = async () => {
  return await UserModel.find();
};

exports.getUserById = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
  return user;
};

exports.createUser = async (data) => {
  const newUser = await UserModel.create(data);

  return newUser;
};

// to update user stats
exports.increaseUserStats = async (id) => {
  const user = await UserModel.findById(id);
  let ge = getGameEmitter();

  if (!user) {
    return null;
  }
  user.stat += 1;
  ge.emit("updateUser", { userId: id, updateFields: { stat: user.stat } });

  await user.save();
  return user.stat;
};

/**
 * Get user statistics.
 *
 * @param id
 * @returns {Promise<*|null>}
 */
exports.getUserStats = async (id) => {
  const user = await UserModel.findById(id);

  if (!user) {
    return null;
  }

  return user.stat;
};

exports.deleteUser = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};

exports.checkUserExists = async (filter) => {
  const userExist = await UserModel.exists(filter);

  if (userExist) throw new HttpError(StatusCodes.CONFLICT, "Email in use");
};
