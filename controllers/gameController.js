const { catchAsync, HttpError } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const gameService = require("../services");

// to create a new game
exports.createGame = catchAsync(async (req, res) => {
  const { name, settings } = req.body;
  const admin = req.user?._id;

  if (!name) throw new HttpError(StatusCodes.BAD_REQUEST, "Game name is required");
  const newGame = await gameService.createGame({
    name,
    adminId: admin,
    settings
  });

  res.status(StatusCodes.CREATED).json({
    message: "Game created successfully",
    game: newGame,
  });
});

// to get all games
exports.getAllGames = catchAsync(async (_req, res) => {
  const games = await GameModel.find()
    .populate("admin", "username email")
    .populate("teams", "name team_score player_list");

  res.status(StatusCodes.OK).json(games);
});

// to get a game by id
exports.getGameById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const game = await GameModel.findById(id)
    .populate("admin", "username email")
    .populate("teams", "name team_score player_list");

  if (!game) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");
  }

  res.status(StatusCodes.OK).json(game);
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

  const deletedGame = await GameModel.findByIdAndDelete(id);

  if (!deletedGame) {
    throw new HttpError(404, "Game not found");
  }

  res.status(200).json({
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
