const { generateVocabulary } = require("../utils/generateVocabulary");

describe("generateVocabulary utility", () => {
    test("should return unique lowercase nouns", () => {
        const words = generateVocabulary(5);

        expect(Array.isArray(words)).toBe(true);
        expect(words.length).toBe(10); // 5 * 2
        expect(words.every((w) => typeof w === "string")).toBe(true);
        expect(words.every((w) => w === w.toLowerCase())).toBe(true);

        const uniqueSet = new Set(words);
        expect(uniqueSet.size).toBe(words.length); // no duplicates
    });

    test("should throw error for invalid input", () => {
        expect(() => generateVocabulary(-3)).toThrow("Invalid round amount");
        expect(() => generateVocabulary("abc")).toThrow("Invalid round amount");
    });
});
