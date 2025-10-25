const natural = require('natural');

/**
 * Normalize a word by converting to lowercase and removing punctuation.
 *
 * @param word
 * @returns {string}
 */
function normalizeWord(word) {
  if (!word) return '';
  return word
    .toLowerCase()
    .replace(/[.,!?;:"'(){}[\]-]/g, '')
    .trim();
}

/**
 * Check if the guess is similar to the target word.
 *
 * @param guess
 * @param target
 * @returns {boolean}
 */
exports.checkGuess = (guess, target) => {
  if (!guess || !target) return false;

  const normalizedGuess = normalizeWord(guess);
  const normalizedTarget = normalizeWord(target);

  // identical words
  if (normalizedGuess === normalizedTarget) return true;

  // check stem similarity
  const distance = natural.LevenshteinDistance(normalizedGuess, normalizedTarget);
  if (distance <= 2) return true;

  return false;
}

/**
 * Check if two words are too similar.
 *
 * @param word
 * @param targetWord
 * @returns {boolean}
 */
exports.isWordTooSimilar = (word, targetWord) => {
  if (!word || !targetWord) return false;

  const normalizedWord = normalizeWord(word);
  const normalizedTarget = normalizeWord(targetWord);

  // Check if words are identical
  if (normalizedWord === normalizedTarget) return true;

  // Check length difference (too different lengths)
  const levenshtein = natural.LevenshteinDistance(normalizedWord, normalizedTarget);
  if (levenshtein <= 2) return true;

  // Check phonetic similarity using Metaphone
  const metaphone = new natural.Metaphone();
  if (metaphone.compare(normalizedWord, normalizedTarget)) return true;

  // Check stem similarity using Porter Stemmer
  const stemWord = natural.PorterStemmer.stem(normalizedWord);
  const stemTarget = natural.PorterStemmer.stem(normalizedTarget);
  if (stemWord === stemTarget) return true;

  // Check if one word is a prefix of the other after stemming
  if (normalizedWord.startsWith(stemTarget) || normalizedTarget.startsWith(stemWord))
    return true;

  return false;
}