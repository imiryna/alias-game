const { getTeamById } = require("./teamService");
const { createGame, endRound, startGameForTeam, getAllGames, getGameById } = require("./gameService");
const { signup, login, refresh } = require("./authService");
const { signToken, checkToken } = require("./jwtService");
const { checkUserExists, createUser, getUserById, updateUserStats, deleteUser } = require("./userService");
const { joinTeam, leftTeam, nextRound } = require("./logicGameService");
const { getChatByTeam, createChatForTeam, createNewMessage } = require("./chatService");

module.exports = {
  getChatByTeam,
  createChatForTeam,
  joinTeam,
  leftTeam,
  nextRound,
  getTeamById,
  checkUserExists,
  createUser,
  getUserById,
  updateUserStats,
  deleteUser,
  signup,
  login,
  refresh,
  signToken,
  checkToken,
  createGame,
  startGameForTeam,
  endRound,
  getAllGames,
  getGameById,
  createNewMessage,
};
