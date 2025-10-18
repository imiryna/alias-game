const GameModel = require("../models/gameModel");
const { catchAsync, HttpError } = require("../utils");

// to create a new game
exports.createGame = catchAsync(async (req, res) => {
  const { name, settings, word_vocabulary } = req.body;
  const admin = req.user?._id;

  if (!name) {
    throw new HttpError(400, "Game name is required");
  }

  const newGame = await GameModel.create({
    name,
    admin,
    settings: settings || {},
    word_vocabulary: word_vocabulary || [],
  });

  res.status(201).json({
    message: "Game created successfully",
    game: newGame,
  });
});

// to get all games
exports.getAllGames = catchAsync(async (_req, res) => {
  const games = await GameModel.find()
    .populate("admin", "username email")
    .populate("teams", "name team_score player_list");

  res.status(200).json(games);
});

// to get a game by id
exports.getGameById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const game = await GameModel.findById(id)
    .populate("admin", "username email")
    .populate("teams", "name team_score player_list");

  if (!game) {
    throw new HttpError(404, "Game not found");
  }

  res.status(200).json(game);
});

// to update a game
exports.updateGame = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedGame = await GameModel.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  })
    .populate("admin", "username email")
    .populate("teams", "name team_score player_list");

  if (!updatedGame) {
    throw new HttpError(404, "Game not found");
  }

  res.status(200).json({
    message: "Game updated successfully",
    game: updatedGame,
  });
});

// to delete a game
exports.deleteGame = catchAsync(async (req, res) => {
  const { id } = req.params;

  const deletedGame = await GameModel.findByIdAndDelete(id);

  if (!deletedGame) {
    throw new HttpError(404, "Game not found");
  }

  res.status(200).json({
    message: "Game deleted successfully",
    game: deletedGame,
  });
});
