const { HttpError, getNextExplainer, pickRandomWord } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const gameService = require("./gameService");
const { getTeamByIdForRound, getTeamById } = require("./teamService");

// Checking that the team is not already on another team in this game
const isTeamExist = async (teamId) => {
  const team = await getTeamById(teamId);
  return team;
};

exports.joinTeam = async (teamId, userId) => {
  const team = await isTeamExist(teamId);

  if (!team) throw new HttpError(StatusCodes.NOT_FOUND, "Team is not exist");

  const gameId = team.game._id;

  // Checking that the player is not already on another team in this game
  const userExist = await gameService.isPlayerInGame(gameId, userId);

  if (userExist) {
    throw new HttpError(StatusCodes.CONFLICT, "Player already in another team");
  }

  team.player_list.push(userId);
  await team.save();

  return team;
};
//   const game = await getGameById(gameId);
//   let inGame = false;
//   const teams = game.teams;
//   teams.forEach((team) => {
//     inGame = team.player_list.includes(userId);
//   });
//   return inGame;
// };

exports.leftTeam = async (teamId, userId) => {
  const team = await getTeamById(teamId);
  team.player_list = team.player_list.filter((pl) => pl._id.toString() !== userId);
  console.log(team.player_list);
  await team.save();
  return team.populate("player_list");
};

/*
Each round can consist of few steps, if team guess words quickly, so 
the basic unit of game - function <nextWord> which take new Explainer,
new word. No checkings
*/
const nextWord = async (team) => {
  const nextExplainer = getNextExplainer(Array.from(team.player_list), team.currentExplainer);
  const _nextWord = pickRandomWord(team);
  return { nextExplainer, _nextWord };
};

exports.nextRound = async (teamId) => {
  const team = await getTeamByIdForRound(teamId);
  // if (!Array.isArray(team.player_list) || team.player_list.length === 0) {
  //   throw new HttpError(StatusCodes.NOT_FOUND, "No players in team");
  // }

  let a = await nextWord(team);

  //  Updating the current round  +1
  team.currentRound.number += 1;
  team.currentRound.isActive = true;
  team.currentRound.current_word = a._nextWord;

  team.currentExplainer = a.nextExplainer._id.toString();

  await team.save();

  return team;
};
