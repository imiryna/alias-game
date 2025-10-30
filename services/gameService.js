const { GameModel, TeamModel } = require("../models");
const { createTeam } = require("./teamService");
const { pickRandomWord, HttpError, generateVocabulary } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { getIO } = require("../socketManager"); // websocket users map

// Helper function: notify all users in a game room via Socket.IO
const notifyUsersByGame = (gameId, message) => {
  const io = getIO();
  if (io) {
    io.to(gameId).emit("gameNotification", { message });
    console.log(`Notified all users in game ${gameId}: ${message}`);
  }
};

// to get all games
exports.getAllGames = async () => {
  return await GameModel.find()
    .populate("admin", "username email")
    .populate("teams", "name team_score player_list");
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

  notifyUsersByGame(game._id, `Game "${game.name}" has been created!`);
  return game;
};

// start a new round
exports.startRound = async (gameId, activeTeamId) => {
  const game = await GameModel.findById(gameId);
  if (!game) throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");

  if (!game.word_vocabulary || game.word_vocabulary.length === 0) {
    throw new HttpError(StatusCodes.NO_CONTENT, "No words left in vocabulary");
  }

  const { word, updatedVocabulary } = pickRandomWord(game.word_vocabulary);

  game.currentRound = {
    ...game.currentRound,
    active_team: activeTeamId,
    current_word: word,
    is_active: true,
    number: game.currentRound.number || 1,
  };

  game.word_vocabulary = updatedVocabulary;
  await game.save();

  return game;
};

// end the current round
exports.endRound = async (gameId, { winningTeamId, points = 1 } = {}) => {
  const game = await GameModel.findById(gameId).populate("teams");
  if (!game) throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");

  // update winning team's score
  if (winningTeamId) {
    const team = await TeamModel.findById(winningTeamId);
    if (team) {
      team.team_score += points;
      team.currentRound.is_active = false;
      team.currentRound.current_word = null;
      await team.save();
    }
  }

  // check number of played rounds
  const playedRounds = Math.max(
    ...(await Promise.all(
      game.teams.map(async (tid) => {
        const t = await TeamModel.findById(tid);
        return t?.currentRound?.number || 0;
      })
    ))
  );

  // if the limit of rounds is reached, end the game
  if (playedRounds >= game.settings.round_amount) {
    return exports.endGame(gameId);
  }

  notifyUsersByGame(game._id, `Round ${playedRounds} ended.`);
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

  notifyUsersByGame(
    game._id,
    `Game "${game.name}" ended! Winner: ${winner.team} (${winner.score} points)`
  );

  // cleanup
  for (const tId of game.teams) {
    const team = await TeamModel.findById(tId);
    if (team) {
      team.player_list = [];
      team.currentRound = { number: 0, current_word: null, is_active: false };
      await team.save();
    }
  }

  game.status = "ended";
  await game.save();

  return {
    message: `Game ended. Winner: ${winner.team}`,
    scores,
  };
};

// delete a game
exports.deleteGame = async (id) => {
  const deleted = await GameModel.findByIdAndDelete(id);
  if (deleted) {
    notifyUsersByGame(deleted._id, `Game "${deleted.name}" has been deleted.`);
  }
  return deleted;
};

// check if a player is in a game
exports.isPlayerInGame = async (gameId, userId) => {
  const game = await this.getGameById(gameId);
  return game.teams.some((team) => team.player_list.includes(userId));
};