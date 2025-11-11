const HttpError = require('../utils/error');
const { StatusCodes } = require("http-status-codes");
const randomWords = require("random-words");

/**
 * Generates a vocabulary list of unique, lowercase words.
 *
 * @param roundAmount {number} - game.settings.word_amount
 * @returns {any[]}
 */
exports.generateVocabulary = async (roundAmount) => {
  if (typeof roundAmount !== "number" || roundAmount <= 0) {
    throw new HttpError(StatusCodes.BAD_REQUEST, "Invalid round amount");
  }

  const totalWords = roundAmount * 3;
  const words = randomWords({ exactly: totalWords * 2, maxLength: 10 }); // generate extra to ensure uniqueness
  const uniqueWords = [...new Set(words.map((w) => w.toLowerCase()))];

  return uniqueWords.slice(0, totalWords);
};

/**
 * Checks and processes a new message.
 *
 * @param teamId
 * @param userId
 * @param newMessage
 * @returns {Promise<string>}
 */
exports.checkingMessageFn = async ({ teamId, userId, newMessage }) => {
  return `>>>>>>> ${newMessage.text} <<<<<<<<<<<`;
};
