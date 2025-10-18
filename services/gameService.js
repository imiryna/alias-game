const { GameModel } = require("../models");

// to create a new game
const createGame = async (gameData, adminId) => {
  const {
    name,
    settings = {},
    word_vocabulary = [],
    teams = [],
    current_round = {},
  } = gameData;

  const newGame = await GameModel.create({
    name,
    admin: adminId,
    teams,
    word_vocabulary,
    settings,
    current_round,
  });

  return await newGame.populate([
    { path: "admin", select: "username email" },
    { path: "teams", select: "name team_score player_list" },
  ]);
};

// to get all games
const getAllGames = async () => {
  return await GameModel.find()
    .populate("admin", "username email")
    .populate("teams", "name team_score player_list");
};

// to get a game by id
const getGameById = async (id) => {
  return await GameModel.findById(id)
    .populate("admin", "username email")
    .populate("teams", "name team_score player_list");
};

// to update a game
const updateGame = async (id, updates) => {
  const updatedGame = await GameModel.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  })
    .populate("admin", "username email")
    .populate("teams", "name team_score player_list");

  return updatedGame;
};

// to delete a game
const deleteGame = async (id) => {
  return await GameModel.findByIdAndDelete(id);
};

module.exports = {
  createGame,
  getAllGames,
  getGameById,
  updateGame,
  deleteGame,
};
