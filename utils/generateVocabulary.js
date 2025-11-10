const { HttpError } = require("./error");
const { StatusCodes } = require("http-status-codes");
const WordPOS = require("wordpos");

/**
 * Generates a vocabulary list of unique, lowercase words.
 * @param roundAmount {number} - game.settings.word_amount
 * @returns {any[]}
 */
exports.generateVocabulary = async (roundAmount) => {
  const wordpos = new WordPOS();

  if (typeof roundAmount !== "number" || roundAmount <= 0) {
    throw new HttpError(StatusCodes.BAD_REQUEST, "Invalid round amount");
  }

  const totalWords = roundAmount * 3;

  let words = await wordpos.randNoun({ count: totalWords });

  words = words.filter((word) => !word.includes("_"));
  const uniqueWords = [...new Set(words.map((w) => w.toLowerCase()))];

  return uniqueWords.slice(0, totalWords);
};
