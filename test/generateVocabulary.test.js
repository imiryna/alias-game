const { generateVocabulary } = require("../utils");
const WordPOS = require("wordpos");
const { HttpError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

jest.mock("wordpos");

describe("generateVocabulary", () => {
  let mockRandNoun;

  beforeEach(() => {
    mockRandNoun = jest.fn();
    WordPOS.mockImplementation(() => ({
      randNoun: mockRandNoun,
    }));
  });

  test("should generate unique, lowercase words", async () => {
    mockRandNoun.mockResolvedValueOnce(["Tree", "Book", "book", "mountain_peak", "River"]);

    const result = await generateVocabulary(2); // 2 rounds -> 6 total words

    // Check normalization and filtering
    expect(result).toEqual(expect.arrayContaining(["tree", "book", "river"]));
    expect(result.some((w) => w.includes("_"))).toBe(false);
    expect(result.every((w) => w === w.toLowerCase())).toBe(true);

    // Should not exceed totalWords
    expect(result.length).toBeLessThanOrEqual(6);
  });

  test("should throw HttpError for invalid roundAmount", async () => {
    await expect(generateVocabulary(-1)).rejects.toThrow(HttpError);
    await expect(generateVocabulary("abc")).rejects.toThrow(HttpError);

    try {
      await generateVocabulary(0);
    } catch (err) {
      expect(err.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(err.message).toBe("Invalid round amount");
    }
  });

  test("should call WordPOS.randNoun with correct count", async () => {
    mockRandNoun.mockResolvedValueOnce(["apple", "banana", "car"]);

    await generateVocabulary(5);

    expect(mockRandNoun).toHaveBeenCalledTimes(1);
    expect(mockRandNoun).toHaveBeenCalledWith({ count: 15 });
  });
});

// describe("generateVocabulary utility", () => {
//     test("should return unique lowercase nouns", () => {
//         const words = generateVocabulary(5);

//         expect(Array.isArray(words)).toBe(true);
//         expect(words.length).toBe(10); // 5 * 2
//         expect(words.every((w) => typeof w === "string")).toBe(true);
//         expect(words.every((w) => w === w.toLowerCase())).toBe(true);

//         const uniqueSet = new Set(words);
//         expect(uniqueSet.size).toBe(words.length); // no duplicates
//     });

//     test("should throw error for invalid input", () => {
//         expect(() => generateVocabulary(-3)).toThrow("Invalid round amount");
//         expect(() => generateVocabulary("abc")).toThrow("Invalid round amount");
//     });
// });
