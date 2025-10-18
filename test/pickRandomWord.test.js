const pickRandomWord = require("../utils/pickRandomWord");

describe("pickRandomWord", () => {
    test("should pick a word and remove it from vocabulary", () => {
        const vocabulary = ["word1", "word2", "word3"];
        const { word, updatedVocabulary } = pickRandomWord(vocabulary);

        expect(vocabulary).toEqual( ["word1", "word2", "word3"]);
        expect(updatedVocabulary.length).toBe(vocabulary.length - 1);
        expect(updatedVocabulary).not.toContain(word);
        expect(["word1", "word2", "word3"]).toContain(word);
    });

    test("should throw error if vocabulary is empty", () => {
        expect(() => pickRandomWord([])).toThrow("Vocabulary is empty or invalid");
    });

    test("should throw error if vocabulary is not an array", () => {
        expect(() => pickRandomWord(null)).toThrow("Vocabulary is empty or invalid");
        expect(() => pickRandomWord("not-an-array")).toThrow("Vocabulary is empty or invalid");
    });
});
