const { StatusCodes } = require("http-status-codes");
const { UserModel } = require("../models");
const { HttpError } = require("../helpers");

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
