const { isWordTooSimilar, checkGuess } = require("../utils");

describe("isWordTooSimilar", () => {
  it("should detect identical words", () => {
    expect(isWordTooSimilar("apple", "apple")).toBe(true);
  });

  it("should detect small typos (Levenshtein)", () => {
    expect(isWordTooSimilar("appl", "apple")).toBe(true);
    expect(isWordTooSimilar("appel", "apple")).toBe(true);
  });

  it("should detect words with the same stem (PorterStemmer)", () => {
    expect(isWordTooSimilar("running", "runner")).toBe(true);
    expect(isWordTooSimilar("plays", "playing")).toBe(true);
    expect(isWordTooSimilar("door", "dormitory")).toBe(false);
    expect(isWordTooSimilar("apple", "orange")).toBe(false);
  });

  it("should detect phonetically similar words (Metaphone)", () => {
    expect(isWordTooSimilar("nite", "night")).toBe(true);
    expect(isWordTooSimilar("fone", "phone")).toBe(true);
  });

  it("should not flag unrelated words", () => {
    expect(isWordTooSimilar("cat", "banana")).toBe(false);
    expect(isWordTooSimilar("table", "cloud")).toBe(false);
  });

  it("should handle null or empty inputs gracefully", () => {
    expect(isWordTooSimilar("", "apple")).toBe(false);
    expect(isWordTooSimilar(null, "apple")).toBe(false);
    expect(isWordTooSimilar("apple", null)).toBe(false);
  });
});

describe('checkGuess', () => {
  test('should normalize and match identical words', () => {
    expect(checkGuess('Apple', 'apple')).toBe(true);
  });

  test('should remove punctuation and still match', () => {
    expect(checkGuess('apple!', 'apple')).toBe(true);
    expect(checkGuess('"Apple,"', 'apple')).toBe(true);
  });

  test('should detect small typos', () => {
    expect(checkGuess('appl', 'apple')).toBe(true);
    expect(checkGuess('appel', 'apple')).toBe(true);
  });

  test('should not match very different words', () => {
    expect(checkGuess('apple', 'banana')).toBe(false);
  });

  test('should handle empty or null inputs gracefully', () => {
    expect(checkGuess('', 'apple')).toBe(false);
    expect(checkGuess(null, 'apple')).toBe(false);
  });
});
