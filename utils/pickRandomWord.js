/**
 * Picks a random word from the vocabulary and returns it along with the updated vocabulary.
 * @param vocabulary
 * @returns {{updatedVocabulary: *[], word: *}}
 */
function pickRandomWord(vocabulary) {
    if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
        throw new Error("Vocabulary is empty or invalid");
    }

    const randomIndex = Math.floor(Math.random() * vocabulary.length);
    const word = vocabulary[randomIndex];

    const updatedVocabulary = [...vocabulary];
    updatedVocabulary.splice(randomIndex, 1);

    return { word, updatedVocabulary };
}

module.exports = pickRandomWord;
