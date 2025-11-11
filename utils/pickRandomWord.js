const { HttpError } = require("./error");
const { StatusCodes } = require("http-status-codes");

/**
 * Picks a random word from the vocabulary and returns it along with the updated vocabulary.
 * @param vocabulary
 * @returns {{updatedVocabulary: *[], word: *}}
 */
exports.pickRandomWord = (teamModel) => {
  if (!Array.isArray(teamModel.word_vocabulary) || teamModel.word_vocabulary.length === 0) {
    throw new HttpError(StatusCodes.BAD_REQUEST, "Vocabulary is empty or invalid");
  }

  const randomIndex = Math.floor(Math.random() * teamModel.word_vocabulary.length);
  const word = teamModel.word_vocabulary[randomIndex];

  teamModel.word_vocabulary.splice(randomIndex, 1);

  return word;
};
