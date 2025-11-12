const { pickRandomWord } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { HttpError } = require("../helpers");

describe("pickRandomWord", () => {
  test("should pick a word and remove it from vocabulary", () => {
    const teamModel = {word_vocabulary: ["word1", "word2", "word3"]};
    const word = pickRandomWord(teamModel);

    expect(["word1", "word2", "word3"]).toContain(word);
  });

  test("should throw error if vocabulary is empty", () => {
    const teamModel = {word_vocabulary: []};
    expect(() => pickRandomWord(teamModel)).toThrow(HttpError);
    expect(() => pickRandomWord(teamModel)).toThrow("Vocabulary is empty or invalid");
  });

  test("should throw error if vocabulary is not an array", () => {
    expect(() => pickRandomWord({word_vocabulary: null})).toThrow(HttpError);
    expect(() => pickRandomWord({word_vocabulary: null})).toThrow("Vocabulary is empty or invalid");

    expect(() => pickRandomWord({word_vocabulary: "not-an-array"})).toThrow(HttpError);
    expect(() => pickRandomWord({word_vocabulary: "not-an-array"})).toThrow("Vocabulary is empty or invalid");
  });
});
