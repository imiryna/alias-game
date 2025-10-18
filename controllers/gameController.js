const gameService = require("../services/gameService");
const { catchAsync, HttpError } = require("../utils");

// to create a new game
exports.createGame = catchAsync(async (req, res) => {
  const adminId = req.user?._id;
  const { name } = req.body;

  if (!name) {
    throw new HttpError(400, "Game name is required");
  }

  const newGame = await gameService.createGame(req.body, adminId);

  res.status(201).json({
    message: "Game created successfully",
    game: newGame,
  });
});

// to get all games
exports.getAllGames = catchAsync(async (_req, res) => {
  const games = await gameService.getAllGames();
  res.status(200).json(games);
});

// to get a game by id
exports.getGameById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const game = await gameService.getGameById(id);

  if (!game) {
    throw new HttpError(404, "Game not found");
  }

  res.status(200).json(game);
});

// to update a game
exports.updateGame = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedGame = await gameService.updateGame(id, req.body);

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
  const deletedGame = await gameService.deleteGame(id);

  if (!deletedGame) {
    throw new HttpError(404, "Game not found");
  }

  res.status(200).json({
    message: "Game deleted successfully",
    game: deletedGame,
  });
});
