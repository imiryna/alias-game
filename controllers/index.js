const { signup, login, refresh } = require("./authController");
const { createGame, getAllGames, getGameById, startGame } = require("./gameController");
const { joinTheTeam, leftTheTeam, nextTeamRound } = require("./logicGameController");
const { getChatByTeam, createChatForTeam, sendMessageToTeam } = require("./chatController");
const { getAllUsers, getUserById, receiveUserStats, deleteUser } = require("./userController");
const { getAllTeams, getTeamById, deleteTeam } = require("./teamController");

module.exports = {
  signup,
  login,
  refresh,
  createGame,
  getAllGames,
  getGameById,
  getAllUsers,
  getUserById,
  receiveUserStats,
  deleteUser,
  joinTheTeam,
  leftTheTeam,
  nextTeamRound,
  getAllTeams,
  getTeamById,
  deleteTeam,
  getChatByTeam,
  createChatForTeam,
  sendMessageToTeam,
  startGame,
};
