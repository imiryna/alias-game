const { StatusCodes } = require('http-status-codes');
const { generateVocabulary } = require('../utils/generateVocabulary');
const HttpError = require('../utils/error');

describe('generateVocabulary', () => {
  it('should throw HttpError if round amount is invalid', async () => {
    const invalidRounds = 0;

    await expect(generateVocabulary(invalidRounds)).rejects.toThrow(HttpError);
    await expect(generateVocabulary(invalidRounds)).rejects.toThrow('Invalid round amount');
  });

  it('should return array of vocab if round amount is valid', async () => {
    const validRounds = 3;
    const vocab = await generateVocabulary(validRounds);

    expect(Array.isArray(vocab)).toBe(true);
    expect(vocab.length).toBe(validRounds * 3); // totalWords
    expect(new Set(vocab).size).toBe(vocab.length); // all words are unique
  });
});
