const mongoose = require("mongoose");
const { GameModel } = require("../models");
const { createGame, startGameForTeam, endRound } = require("../services");
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

  test("should start a new round and pick a word", async () => {
    const teamId = new mongoose.Types.ObjectId();
    const updatedGame = await startRound(game._id, teamId);

    expect(updatedGame.currentRound.is_active).toBe(true);
    expect(updatedGame.currentRound.current_word).toBe("dancer");
    expect(updatedGame.currentRound.active_team.toString()).toBe(teamId.toString());
    expect(updatedGame.word_vocabulary).toEqual(["game", "book"]);
  });

  test("should end the current round", async () => {
    const teamId = new mongoose.Types.ObjectId();
    await startGameForTeam(game._id, teamId);

    const endedGame = await endRound(game._id);

    expect(endedGame.currentRound.is_active).toBe(false);
    expect(endedGame.currentRound.current_word).toBeNull();
    expect(endedGame.currentRound.active_team).toBeNull();
    expect(endedGame.currentRound.number).toBe(2);
  });
});
