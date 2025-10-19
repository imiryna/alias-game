const { HttpError } = require('../utils');
const { StatusCodes } = require("http-status-codes");

/**
 * Picks a random word from the vocabulary and returns it along with the updated vocabulary.
 * @param vocabulary
 * @returns {{updatedVocabulary: *[], word: *}}
 */
exports.pickRandomWord = (vocabulary) => {
    if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
        throw new HttpError(StatusCodes.BAD_REQUEST, "Vocabulary is empty or invalid");
    }

    const randomIndex = Math.floor(Math.random() * vocabulary.length);
    const word = vocabulary[randomIndex];

    const updatedVocabulary = [...vocabulary];
    updatedVocabulary.splice(randomIndex, 1);

    return { word, updatedVocabulary };
};
