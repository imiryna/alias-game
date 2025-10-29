const { createGame, getAllGames, getGameById, startGameForTeam, endRound, getFreeGamesOrCreateOne } = require("../services");
const { catchAsync } = require("../utils");
const { StatusCodes } = require("http-status-codes");

exports.createGame = catchAsync(async (req, res) => {
  const { name, settings } = req.body;
  const adminId = req.user?._id;

  const newGame = await createGame({ name, adminId, settings });

  res.status(StatusCodes.CREATED).json({
    message: "Success",
    game: newGame,
  });
});

exports.getAllGames = catchAsync(async (_, res) => {
  const games = await getAllGames();
  res.status(StatusCodes.OK).json(games);
});

// to get a game by id
exports.getGameById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const game = await getGameById(id);

  res.status(StatusCodes.OK).json(game);
});

// start a game for the team
exports.startGame = catchAsync(async (req, res) => {
  const { gameId, teamId } = req.body;
  const game = await startGameForTeam(gameId, teamId);

  res.status(StatusCodes.OK).json({
    message: "Round started",
    currentRound: game.currentRound,
    remainingVocabulary: game.word_vocabulary,
  });
});

// end the current round
exports.endRound = catchAsync(async (req, res) => {
  const { gameId } = req.body;
  const game = await endRound(gameId);

  res.status(StatusCodes.OK).json({
    message: "Round ended",
    currentRound: game.currentRound,
  });
});

// get a free game or create one
exports.getFreeGamesOrCreateOne = catchAsync(async (req, res) => {
  const adminId = req.user?._id;
  const game = await getFreeGamesOrCreateOne(adminId);

  res.status(StatusCodes.OK).json({
    message: "Free game fetched or created",
    game,
  });
});
