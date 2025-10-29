const { signup, login, refresh } = require("./authController");
const { createGame, getAllGames, getGameById, endRound, startGame } = require("./gameController");
const { joinTheTeam, leftTheTeam, nextTeamRound } = require("./logicGameController");
const { getChatByTeam, createChatForTeam, sendMessageToTeam } = require("./chatController");

module.exports = {
  signup,
  login,
  refresh,
  createGame,
  getAllGames,
  getGameById,
  endRound,
  startGame,
  joinTheTeam,
  leftTheTeam,
  nextTeamRound,
  getChatByTeam,
  createChatForTeam,
  sendMessageToTeam,
};
