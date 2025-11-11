const mongoose = require("mongoose");
const { GameModel } = require("../models");
const { createGame } = require("../services");
const { generateVocabulary, pickRandomWord } = require("../utils");

jest.mock("../utils/generateVocabulary");
jest.mock("../utils/pickRandomWord");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Game Service", () => {
  let game;

  beforeEach(async () => {
    await GameModel.deleteMany({});

    generateVocabulary.mockReturnValue(["dancer", "game", "book"]);

    pickRandomWord.mockImplementation((vocab) => {
      const word = vocab[0];
      const updatedVocabulary = vocab.slice(1);
      return { word, updatedVocabulary };
    });

    game = await createGame({
      name: "Test Game",
      adminId: new mongoose.Types.ObjectId(),
      settings: { word_amount: 5 },
    });
  });

  test("should create a new game with generated vocabulary", () => {
    expect(game).toBeDefined();
    expect(game.name).toBe("Test Game");
    expect(game.word_vocabulary.length).toBe(3);
    expect(game.currentRound.is_active).toBe(false);
    expect(game.currentRound.number).toBe(1);
  });
});
