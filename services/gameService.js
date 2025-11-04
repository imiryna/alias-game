const { GameModel, TeamModel } = require("../models");
const { createTeam, getTeamByIdForRound } = require("./teamService");
const { HttpError, generateVocabulary, TEAM_STATUS } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { getOnlineUsers } = require("../socketManager"); // websocket users map
const { nextRound } = require("./logicGameService");

// to get all games
exports.getAllGames = async () => {
  return await GameModel.find().populate("admin", "username email").populate("teams", "name team_score player_list");
};

// to get a game by id
exports.getGameById = async (id) => {
  const game = await GameModel.findById(id)
    .populate("admin", "username email")
    .populate({
      path: "teams",
      select: "name team_score player_list",
      populate: {
        path: "player_list",
        select: "username name",
      },
    });

  if (!game) throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");
  return game;
};

// to create a new game
exports.createGame = async ({ name, adminId, settings = {} }) => {
  if (!name) throw new HttpError(StatusCodes.BAD_REQUEST, "Game name is required");

  // the checking of default team name is in createTeam
  const team1 = await createTeam();
  const team2 = await createTeam();

  const roundAmount = settings.round_amount || 5;
  const wordAmount = settings.word_amount || 10;
  const vocabulary = await generateVocabulary(wordAmount);

  const game = await GameModel.create({
    name,
    admin: adminId,
    teams: [team1._id, team2._id],
    settings: { ...settings, round_amount: roundAmount, word_amount: wordAmount },
    word_vocabulary: vocabulary,
    status: "waiting",
  });

  team1.game = game._id;
  team2.game = game._id;
  await team1.save();
  await team2.save();

  return game;
};

// Start a game for given team
exports.startGameForTeam = async (gameId, teamId) => {
  const game = await GameModel.findById(gameId);
  if (!game) throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");

  // Check vocabulary, if not - generate and stor vocabulary
  if (!game.word_vocabulary || game.word_vocabulary.length === 0) {
    game.word_vocabulary = generateVocabulary(game.settings.round_amount);

    await game.save();
  }

  // update team vocabulary before game start
  const team = await getTeamByIdForRound(teamId);
  //const team = await TeamModel.findById(teamId).populate("player_list");
  team.word_vocabulary = game.word_vocabulary;
  // team.save();

  if (!team) throw new HttpError(StatusCodes.NOT_FOUND, "Team not found");

  const users = Array.from(team.player_list);

  // check amount of users
  let onlinUsers = getOnlineUsers().keys();
  onlinUsers = Array.from(onlinUsers);
  const minUsers = 2;
  let intersection = users.filter((e) => onlinUsers.includes(e.id));

  const userCount = intersection.length;

  //TODO stop everything when game over. Not going foeward
  // if (userCount < minUsers) {
  //   gameOver(team);
  // }
  if (userCount < minUsers) {
    return team;
  }

  nextRound(team);

  return team;
};

exports.gameOver = async (teamModel) => {
  teamModel.team_score = 0;
  teamModel.status = TEAM_STATUS.ENDED;
  teamModel.player_list = [];
  await teamModel.save();
};

//End the current round

exports.endRound = async (gameId) => {
  const game = await GameModel.findById(gameId);
  if (!game) throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");

  game.currentRound.is_active = false;
  game.currentRound.current_word = null;
  game.currentRound.active_team = null;
  game.currentRound.number = (game.currentRound.number || 1) + 1;

  await game.save();
  return game;
};

// end the game
exports.endGame = async (gameId) => {
  const game = await GameModel.findById(gameId).populate("teams");
  if (!game) throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");

  const scores = await Promise.all(
    game.teams.map(async (tId) => {
      const t = await TeamModel.findById(tId);
      return { team: t.name, score: t.team_score };
    })
  );

  const winner = scores.reduce((a, b) => (a.score > b.score ? a : b));

  // cleanup
  for (const tId of game.teams) {
    const team = await TeamModel.findById(tId);
    if (team) {
      team.player_list = [];
      team.status = TEAM_STATUS.ENDED;
      team.currentRound = { number: 0, current_word: null, is_active: false };
      await team.save();
    }
  }

  game.status = TEAM_STATUS.ENDED;
  await game.save();

  return {
    message: `Game ended. Winner: ${winner.team}`,
    scores,
  };
};

// delete a game
exports.deleteGame = async (id) => {
  const deleted = await GameModel.findByIdAndDelete(id);

  return deleted;
};

// check if a player is in a game
exports.isPlayerInGame = async (gameId, userId) => {
  const game = await this.getGameById(gameId);
  return game.teams.some((team) => team.player_list.includes(userId));
};
