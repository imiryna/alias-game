const { GameModel, Team } = require("../models");
const { createTeam } = require("./teamService");
const { pickRandomWord, HttpError, generateVocabulary } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { getOnlineUsers } = require("../socketManager"); // websocket users map 

// Helper: the notification online users by Socket.IO
const notifyUsersByGame = async (game, message, io) => {
  const onlineUsers = getOnlineUsers();
  const userIds = [];

  for (const teamId of game.teams) {
    const team = await Team.findById(teamId).populate("player_list", "_id");
    if (team) {
      team.player_list.forEach((p) => userIds.push(p._id.toString()));
    }
  }

  userIds.forEach((userId) => {
    const socketId = onlineUsers.get(userId);
    if (socketId && io) {
      io.to(socketId).emit("gameNotification", { message });
      console.log(`Notified user ${userId}: ${message}`);
    }
  });
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
exports.createGame = async ({ name, adminId, settings = {}, io }) => {
  if (!name) throw new HttpError(StatusCodes.BAD_REQUEST, "Game name is required");

  const team1 = await createTeam({ name: "Team 1" });
  const team2 = await createTeam({ name: "Team 2" });

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

  await notifyUsersByGame(game, `Game "${game.name}" has been created!`, io);
  return game;
};

// Start a new round

exports.startRound = async (gameId, activeTeamId) => {
  const game = await GameModel.findById(gameId);
  if (!game) throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");

  if (!game.word_vocabulary || game.word_vocabulary.length === 0) {
    throw new HttpError(StatusCodes.NO_CONTENT, "No words left in vocabulary");
  }

  // todo check amount of users

  // todo

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

// end round
exports.endRound = async (gameId, { winningTeamId, points = 1 } = {}, io) => {
  const game = await GameModel.findById(gameId).populate("teams");
  if (!game) throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");

  // to update the winning team's score
  if (winningTeamId) {
    const team = await Team.findById(winningTeamId);
    if (team) {
      team.team_score += points;
      team.currentRound.is_active = false;
      team.currentRound.current_word = null;
      await team.save();
    }
  }

  // to check how many rounds have been played
  const playedRounds = Math.max(
    ...(await Promise.all(
      game.teams.map(async (tid) => {
        const t = await Team.findById(tid);
        return t?.currentRound?.number || 0;
      })
    ))
  );

  // if the limit of rounds is reached, end the game
  if (playedRounds >= game.settings.round_amount) {
    return exports.endGame(gameId, io);
  }

  await notifyUsersByGame(game, `Round ${playedRounds} ended.`, io);
  return game;
};

// end game
exports.endGame = async (gameId, io) => {
  const game = await GameModel.findById(gameId).populate("teams");
  if (!game) throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");

  const scores = await Promise.all(
    game.teams.map(async (tId) => {
      const t = await Team.findById(tId);
      return { team: t.name, score: t.team_score };
    })
  );

  const winner = scores.reduce((a, b) => (a.score > b.score ? a : b));

  await notifyUsersByGame(
    game,
    `Game "${game.name}" ended! Winner: ${winner.team} (${winner.score} points)`,
    io
  );

  // the cleaning up users after game end
  for (const tId of game.teams) {
    const team = await Team.findById(tId);
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

// to delete a game
exports.deleteGame = async (id, io) => {
  const deleted = await GameModel.findByIdAndDelete(id);
  if (deleted) {
    await notifyUsersByGame(deleted, `Game "${deleted.name}" has been deleted.`, io);
  }
  return deleted;
};

// check if a player is in a game
exports.isPlayerInGame = async (gameId, userId) => {
  const game = await this.getGameById(gameId);
  return game.teams.some((team) => team.player_list.includes(userId));
};
