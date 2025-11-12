const { GameModel } = require("../models");
const gameService = require("../services/gameService");
const { createTeam, getTeamByIdForRound } = require("../services/teamService");
const { createChatForTeam } = require("../services/chatService");
const { generateVocabulary } = require("../utils");
const { getGameEmitter, getOnlineUsers } = require("../events/gameEmitter");

jest.mock("../services/teamService");
jest.mock("../services/chatService");
jest.mock("../utils");
jest.mock("../events/gameEmitter");

describe("Game Service", () => {
  let mockTeam, mockGame, geEmit;

  beforeEach(() => {
    geEmit = jest.fn();
    getGameEmitter.mockReturnValue({ emit: geEmit });
    getOnlineUsers.mockReturnValue(new Map([["user1", true], ["user2", true]]));

    mockTeam = {
      _id: "team1",
      player_list: ["user1", "user2"],
      save: jest.fn().mockResolvedValue(true),
      word_vocabulary: [],
    };

    mockGame = {
      _id: "game1",
      name: "Test Game",
      settings: { round_amount: 5, word_amount: 3 },
      word_vocabulary: [],
      save: jest.fn().mockResolvedValue(true),
    };

    createTeam.mockResolvedValue(mockTeam);
    getTeamByIdForRound.mockResolvedValue(mockTeam);
    createChatForTeam.mockResolvedValue(true);
    generateVocabulary.mockReturnValue(["word1", "word2", "word3"]);

    GameModel.create = jest.fn().mockResolvedValue(mockGame);
    GameModel.findById = jest.fn().mockResolvedValue(mockGame);
    GameModel.find = jest.fn(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockGame]),
    }));

    GameModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockGame);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("createGame should create a new game with teams and vocabulary", async () => {
    const game = await gameService.createGame({
      name: "Test Game",
      settings: { word_amount: 3, round_amount: 5 },
    });

    expect(game).toBeDefined();
    expect(game.name).toBe("Test Game");
    expect(generateVocabulary).toHaveBeenCalledWith(3);
    expect(GameModel.create).toHaveBeenCalled();
    expect(createTeam).toHaveBeenCalledTimes(2);
    expect(createChatForTeam).toHaveBeenCalledTimes(2);
  });

  test("deleteGame should delete a game by id", async () => {
    const deleted = await gameService.deleteGame("game123");
    expect(deleted).toBe(mockGame);
    expect(GameModel.findByIdAndDelete).toHaveBeenCalledWith("game123");
  });

  test("getAllGames should return all games", async () => {
    const games = await gameService.getAllGames();
    expect(games).toHaveLength(1);
    expect(games[0].name).toBe("Test Game");
  });

  test("startGameForTeam should not start if not enough online users", async () => {
    getOnlineUsers.mockReturnValue(new Map([["user1", true]]));
    mockTeam.player_list = ["user1", "user2"];

    const team = await gameService.startGameForTeam("game1", "team1");

    expect(team).toBe(mockTeam);
    expect(geEmit).toHaveBeenCalledWith("chat:sysMessage", {
      teamId: "team1",
      message: "Game cannot start — not enough players! ",
    });
  });
});
