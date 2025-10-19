const gameService = require("../services/gameService");
const { catchAsync, HttpError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

// to create a new game
exports.createGame = catchAsync(async (req, res) => {
  const { name, settings } = req.body;
  const adminId = req.user?._id;

  if (!name) {
    throw new HttpError(StatusCodes.BAD_REQUEST, "Game name is required");
  }

  const newGame = await gameService.createGame({ name, adminId, settings });

  res.status(StatusCodes.CREATED).json({
    message: "Game created successfully",
    game: newGame,
  });
});

// to get all games
exports.getAllGames = catchAsync(async (_req, res) => {
  const games = await gameService.getAllGames();
  res.status(StatusCodes.OK).json(games);
});

// to get a game by id
exports.getGameById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const game = await gameService.getGameById(id);

  if (!game) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");
  }

  res.status(StatusCodes.OK).json(game);
});

// to update a game
exports.updateGame = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedGame = await gameService.updateGame(id, req.body);

  if (!updatedGame) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");
  }

  res.status(StatusCodes.OK).json({
    message: "Game updated successfully",
    game: updatedGame,
  });
});

// to delete a game
exports.deleteGame = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedGame = await gameService.deleteGame(id);

  if (!deletedGame) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");
  }

  res.status(StatusCodes.OK).json({
    message: "Game deleted successfully",
    game: deletedGame,
  });
});

// start a new round
exports.startRound = catchAsync(async (req, res) => {
  const { gameId, teamId } = req.body;
  const game = await gameService.startRound(gameId, teamId);

  res.status(StatusCodes.OK).json({
    message: "Round started",
    currentRound: game.current_round,
    remainingVocabulary: game.word_vocabulary,
  });
});

// end the current round
exports.endRound = catchAsync(async (req, res) => {
  const { gameId } = req.body;
  const game = await gameService.endRound(gameId);

  res.status(StatusCodes.OK).json({
    message: "Round ended",
    currentRound: game.current_round,
  });
});

// get a free game or create one
exports.getFreeGamesOrCreateOne = catchAsync(async (req, res) => {
  const adminId = req.user?._id;
  const game = await gameService.getFreeGamesOrCreateOne(adminId);

  res.status(StatusCodes.OK).json({
    message: "Free game fetched or created",
    game,
  });
});
