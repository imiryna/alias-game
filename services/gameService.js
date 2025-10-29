const { GameModel, TeamModel } = require("../models");
const { createTeam } = require("./teamService");
const { HttpError, generateVocabulary } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { getOnlineUsers } = require("../socketManager");
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

  if (!game) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");
  }
  return game;
};

// Create a new game with teams and generate word vocabulary using WordPOS
exports.createGame = async ({ name, adminId, settings = {} }) => {
  if (!name) throw new HttpError(StatusCodes.BAD_REQUEST, "Game name is required");

  // create two teams for the game
  const team1 = await createTeam();
  const team2 = await createTeam();

  // determine word amount from settings or use default
  const wordAmount = settings.word_amount || 10;

  // determine roun amount or use default
  const roundAmount = settings.round_amount || 10;

  // to get random nouns for the game's word vocabulary
  const nouns = await generateVocabulary(roundAmount);

  const game = await GameModel.create({
    name,
    admin: adminId,
    teams: [team1._id, team2._id],
    settings: { ...settings, word_amount: wordAmount, round_amount: roundAmount },
    word_vocabulary: nouns,
    currentRound: { number: 1, is_active: false },
  });

  // save the game reference in teams
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
  const team = await TeamModel.findById(teamId).populate("player_list");
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
  nextRound(teamId);

  return team;
};

const gameOver = async (teamModel) => {
  teamModel.team_score = 0;
  teamModel.status = "ended";
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

//to find a game with missing team(s) or insufficient players
const findGameWithSpace = async () => {
  return await GameModel.findOne({
    $or: [
      { teams: { $size: 0 } },
      { "teams.1": { $exists: false } }, // second team missing
    ],
  }).populate({
    path: "teams",
    populate: { path: "player_list", select: "username email" },
  });
};

// to get a free game or create a new one with 2 teams
exports.getFreeGamesOrCreateOne = async (adminId) => {
  let game = await findGameWithSpace();

  if (!game) {
    // create a new game
    game = await this.createGame({ name: `Game_${Date.now()}`, adminId });
  } else {
    // check if we need to add missing teams

    const existingTeamsCount = game.teams.length;

    if (existingTeamsCount < 2) {
      const team = await createTeam({ name: `Team ${existingTeamsCount + 1}` });
      game.teams.push(team._id);
      await game.save();
    }
  }

  return game
    .populate({
      path: "teams",
      populate: { path: "player_list", select: "username email" },
    })
    .populate("admin", "username email");
};

// to delete a game
exports.deleteGame = async (id) => {
  return await GameModel.findByIdAndDelete(id);
};

exports.isPlayerInGame = async (gameId, userId) => {
  const game = await this.getGameById(gameId);
  let inGame = false;
  const teams = game.teams;
  // TODO Promise to array
  teams.forEach((team) => {
    inGame = team.player_list.includes(userId);
  });
  return inGame;
};
