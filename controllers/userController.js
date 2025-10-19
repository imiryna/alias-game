const userService = require("../services/userService");
const { catchAsync, HttpError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

// to get all users
const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(StatusCodes.OK).json(users);
});

// to get a user by id
const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  if (!user) {
    throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
  }

  res.status(StatusCodes.OK).json(user);
});

// to create a new user
/*const createUser = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new HttpError(400, "All fields are required");
  }

  const newUser = await userService.createUser({ username, email, password });

  res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
});*/

// to update user stats
const updateUserStats = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { gamesPlayed, wins } = req.body;

  const updatedStats = await userService.updateUserStats(id, { gamesPlayed, wins });

  if (!updatedStats) {
    throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
  }

  res.status(StatusCodes.OK).json({
    message: "User stats updated successfully",
    stats: updatedStats,
  });
});

// to delete a user
const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.deleteUser(req.params.id);

  if (!user) {
    throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
  }

  res.status(StatusCodes.OK).json({ message: "User deleted successfully" });
});

module.exports = {
  getAllUsers,
  getUserById,
  //createUser,
  updateUserStats,
  deleteUser,
};
