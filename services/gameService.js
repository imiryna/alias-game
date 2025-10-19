const { GameModel} = require("../models");
const { generateVocabulary, pickRandomWord, HttpError} = require("../utils");
const { StatusCodes } = require("http-status-codes");

/**
 * Create a new game
 *
 * @param name
 * @param adminId
 * @param settings
 * @returns {Promise<*>}
 */
exports.createGame = async ({ name, adminId, settings = {} }) => {
    if (!name) throw new HttpError(StatusCodes.BAD_REQUEST, "Game name is required");

    const wordAmount = settings.word_amount || 10;
    const vocabulary = generateVocabulary(wordAmount);

    return await GameModel.create({
        name,
        admin: adminId,
        settings: { ...settings, word_amount: wordAmount },
        word_vocabulary: vocabulary,
        current_round: { number: 1, is_active: false },
    });
};

/**
 * Start a new round
 *
 * @param gameId
 * @param activeTeamId
 * @returns {Promise<{word_vocabulary}|*>}
 */
exports.startRound = async (gameId, activeTeamId) => {
    const game = await GameModel.findById(gameId);
    if (!game) throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");

    if (!game.word_vocabulary || game.word_vocabulary.length === 0) {
        throw new HttpError(StatusCodes.NO_CONTENT, "No words left in vocabulary");
    }

    const { word, updatedVocabulary } = pickRandomWord(game.word_vocabulary);

    game.current_round = {
        ...game.current_round,
        active_team: activeTeamId,
        current_word: word,
        is_active: true,
        number: game.current_round.number || 1,
    };

    game.word_vocabulary = updatedVocabulary;
    await game.save();

    return game;
};

/**
 * End the current round
 *
 * @param gameId
 * @returns {Promise<*>}
 */
exports.endRound = async (gameId) => {
    const game = await GameModel.findById(gameId);
    if (!game) throw new HttpError(StatusCodes.NOT_FOUND, "Game not found");

    game.current_round.is_active = false;
    game.current_round.current_word = null;
    game.current_round.active_team = null;
    game.current_round.number = (game.current_round.number || 1) + 1;

    await game.save();
    return game;
};
