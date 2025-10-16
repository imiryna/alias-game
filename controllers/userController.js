const User = require("../models/userModel.js");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-passwordHash");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user", error: error.message });
  }
};

const updateUserStats = async (req, res) => {
  try {
    const { gamesPlayed, wins } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (gamesPlayed !== undefined) user.stat.gamesPlayed = gamesPlayed;
    if (wins !== undefined) user.stat.wins = wins;

    await user.save();

    res.status(200).json({
      message: "User stats updated successfully",
      stats: user.stat,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update stats", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStats,
  deleteUser,
};
