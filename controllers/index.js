const { signup, login, refresh } = require("./authController");
const { createGame, getAllGames, getGameById, endRound, startRound, endGame,startGameForTeam } = require("./gameController");
const { joinTheTeam, leftTheTeam, nextTeamRound } = require("./logicGameController");
const { getChatByTeam, createChatForTeam, sendMessageToTeam } = require("./chatController");

module.exports = {
  signup,
  login,
  refresh,
  createGame,
  getAllGames,
  endGame,
  getGameById,
  endRound,
  startRound,
  joinTheTeam,
  leftTheTeam,
  nextTeamRound,
  getChatByTeam,
  createChatForTeam,
  sendMessageToTeam,
  startGameForTeam,
};
