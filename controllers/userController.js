const { getUserById, getAllUsers, getUserStats, deleteUser } = require("../services");
const { catchAsync, HttpError } = require("../helpers");
const { StatusCodes } = require("http-status-codes");

// to get all users
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await getAllUsers();

  users.map((user) => (user.password = undefined));
  res.status(StatusCodes.OK).json(users);
});

// to get a user by id
exports.getUserById = catchAsync(async (req, res) => {
  const user = await getUserById(req.params.id);

  if (!user) {
    throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
  }
  user.password = undefined;
  res.status(StatusCodes.OK).json(user);
});

/**
 * Controller to get user statistics.
 *
 * @type {(function(*, *, *): void)|*}
 */
exports.receiveUserStats = catchAsync(async (req, res) => {
  const { id } = req.params;

  const stats = await getUserStats(id);

  if (stats === null) {
    throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
  }

  res.status(StatusCodes.OK).json({
    message: "User stats retrieved successfully",
    stats,
  });
});

// to delete a user
exports.deleteUser = catchAsync(async (req, res) => {
  const user = await deleteUser(req.params.id);

  if (!user) {
    throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
  }

  res.status(StatusCodes.OK).json({ message: "Success" });
});
