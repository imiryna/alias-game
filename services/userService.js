const { UserModel } = require("../models/");
const { HttpError } = require("../utils");

// to get all users list
exports.getAllUsers = async () => {
  return await UserModel.find({}, "-passwordHash");
};

// to get a user by id
exports.getUserById = async (id) => {
  return await UserModel.findById(id, "-passwordHash");
};

// to create a new user
/*const createUser = async (userData) => {
  return await User.create(userData);
};*/

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

  if (userExist) throw new HttpError(409, "Email in use");
};
