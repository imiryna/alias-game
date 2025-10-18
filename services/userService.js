const { UserModel } = require("../models/");

// to get all users list
const getAllUsers = async () => {
  return await UserModel.find({}, "-passwordHash");
};

// to get a user by id
const getUserById = async (id) => {
  return await UserModel.findById(id, "-passwordHash");
};

// to create a new user
/*const createUser = async (userData) => {
  return await User.create(userData);
};*/

// to update user stats
const updateUserStats = async (id, statsData) => {
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
const deleteUser = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};

module.exports = {
  getAllUsers,
  getUserById,
  //createUser,
  updateUserStats,
  deleteUser,
};
