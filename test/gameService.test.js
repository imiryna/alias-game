const mongoose = require("mongoose");
const GameModel = require("../models/gameModel");
const gameService = require("../services/gameService");
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

        generateVocabulary.mockReturnValue([
            "dancer",
            "game",
            "book"
        ]);

        pickRandomWord.mockImplementation((vocab) => {
            const word = vocab[0];
            const updatedVocabulary = vocab.slice(1);
            return { word, updatedVocabulary };
        });

        game = await gameService.createGame({
            name: "Test Game",
            adminId: new mongoose.Types.ObjectId(),
            settings: { word_amount: 5 },
        });
    });

    test("should create a new game with generated vocabulary", () => {
        expect(game).toBeDefined();
        expect(game.name).toBe("Test Game");
        expect(game.word_vocabulary.length).toBe(3);
        expect(game.current_round.is_active).toBe(false);
        expect(game.current_round.number).toBe(1);
    });

    test("should start a new round and pick a word", async () => {
        const teamId = new mongoose.Types.ObjectId();
        const updatedGame = await gameService.startRound(game._id, teamId);

        expect(updatedGame.current_round.is_active).toBe(true);
        expect(updatedGame.current_round.current_word).toBe("dancer");
        expect(updatedGame.current_round.active_team.toString()).toBe(teamId.toString());
        expect(updatedGame.word_vocabulary).toEqual(["game", "book"]);
    });

    test("should end the current round", async () => {
        const teamId = new mongoose.Types.ObjectId();
        await gameService.startRound(game._id, teamId);

        const endedGame = await gameService.endRound(game._id);

        expect(endedGame.current_round.is_active).toBe(false);
        expect(endedGame.current_round.current_word).toBeNull();
        expect(endedGame.current_round.active_team).toBeNull();
        expect(endedGame.current_round.number).toBe(2);
    });
});
