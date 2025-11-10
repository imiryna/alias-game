const { GameModel } = require("../models");
const { createTeam, getTeamByIdForRound } = require("./teamService");
const { createChatForTeam } = require("./chatService");
const { HttpError, generateVocabulary } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { getOnlineUsers } = require("../events/gameEmitter"); // websocket users map
const { nextRound } = require("./logicGameService");
const { generateSlug } = require("random-word-slugs");
const { getGameEmitter } = require("../events/gameEmitter");

// to get all games
exports.getAllGames = async () => {
  return await GameModel.find().populate("admin", "username email").populate("teams", "name team_score player_list isFull");
};

// to get a game by id
exports.getGameById = async (id) => {
  const game = await GameModel.findById(id)
    .populate("admin", "username email")
    .populate({
      path: "teams",
      select: "name team_score player_list isFull",
      populate: {
        path: "player_list",
        select: "username name",
      },
    });

  if (!game) throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");

  return game;
};

// to create a new game
exports.createGame = async ({ name, settings = {} }) => {
  if (!name) {
    name = generateSlug()
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  }

  // the checking of default team name is in createTeam
  const team1 = await createTeam();
  const team2 = await createTeam();

  const roundAmount = settings.round_amount || 5;
  const wordAmount = settings.word_amount || 10;
  const vocabulary = await generateVocabulary(wordAmount);

  // Creat chat for teams
  await createChatForTeam(team1._id);
  await createChatForTeam(team2._id);

  const game = await GameModel.create({
    name,
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
  const ge = getGameEmitter();

  const game = await GameModel.findById(gameId);
  if (!game) throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");

  // Check vocabulary, if not - generate and stor vocabulary
  if (!game.word_vocabulary || game.word_vocabulary.length === 0) {
    game.word_vocabulary = generateVocabulary(game.settings.round_amount);

    await game.save();
  }

  // update team vocabulary before game start
  const team = await getTeamByIdForRound(teamId);

  team.word_vocabulary = game.word_vocabulary;

  if (!team) throw new HttpError(StatusCodes.NOT_FOUND, "Team not found");

  const users = Array.from(team.player_list);

  // check amount of users
  let onlinUsers = getOnlineUsers().keys();
  onlinUsers = Array.from(onlinUsers);
  const minUsers = 2;
  let intersection = users.filter((e) => onlinUsers.includes(e.toString()));

  const userCount = intersection.length;

  if (userCount < minUsers) {
    ge.emit("chat:newMessage", { teamId, message: "Game cannot start — not enough players! " });
    return team;
  }

  nextRound(teamId);

  return team;
};

// delete a game
exports.deleteGame = async (id) => {
  const deleted = await GameModel.findByIdAndDelete(id);

  return deleted;
};

// check if a player is in a game
exports.isPlayerInGame = async (gameId, userId) => {
  const game = await this.getGameById(gameId);
  let allUsersInGame = [];
  game.teams.forEach((t) => console.log(t.player_list));
  game.teams.forEach((t) => t.player_list.forEach((p) => allUsersInGame.push(p._id.toString())));
  const inGame = allUsersInGame.includes(userId);
  return inGame;
};
