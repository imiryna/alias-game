const { chooseNextExplainer } = require("./teamService");
const { createGame, endRound, startRound } = require("./gameService");
// const { checkUserExists, signup } = require("./authService");
const { signToken, checkToken } = require("./jwtService");

module.exports = {
  // checkUserExists,
  // signup,
  signToken,
  checkToken,
  chooseNextExplainer,
  createGame,
  startRound,
  endRound,
};

// const { signup } = require("./authService");
// const { signToken, checkToken } = require("./jwtService");

// module.exports = {
//   checkUserExists,
//   signup,
//   signToken,
//   checkToken,
// };
