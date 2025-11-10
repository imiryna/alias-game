// nextRound.test.js
const { nextRound } = require("../path/to/your/module");
const { HttpError } = require("../utils");
// const { StatusCodes } = require("http-status-codes");

// Mock dependencies
jest.mock("../services/logicGameService/nextWord", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../services/logicGameService/timerTick", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../events/gameEmitter/getGameEmitter", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Import mocks after jest.mock calls
const nextWord = require("../services/logicGameService/nextWord").default;
const timerTick = require("../services/logicGameService/timerTick").default;
const getGameEmitter = require("../socketManager/getGameEmitter").default;

describe("nextRound()", () => {
  let team;
  let mockEmitter;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEmitter = { emit: jest.fn() };
    getGameEmitter.mockReturnValue(mockEmitter);

    team = {
      _id: "team123",
      player_list: [{ _id: "p1" }, { _id: "p2" }],
      currentRound: { number: 1 },
    };
  });

  it("throws an error if there are no players", async () => {
    const badTeam = { player_list: [] };
    await expect(nextRound(badTeam)).rejects.toThrow(HttpError);
  });

  it("calls nextWord() and timerTick()", async () => {
    nextWord.mockResolvedValue({
      _nextWord: "banana",
      nextExplainer: { _id: "user123" },
    });

    await nextRound(team);

    expect(nextWord).toHaveBeenCalledWith(team);
    expect(timerTick).toHaveBeenCalledWith(team);
  });

  it("emits updateTeam with correct data", async () => {
    nextWord.mockResolvedValue({
      _nextWord: "apple",
      nextExplainer: { _id: { toString: () => "user1" } },
    });

    await nextRound(team);

    expect(mockEmitter.emit).toHaveBeenCalledWith("updateTeam", {
      teamId: "team123",
      updateFields: expect.objectContaining({
        currentRound: expect.objectContaining({
          number: 2,
          isActive: true,
          current_word: "apple",
        }),
        currentExplainer: "user1",
      }),
    });
  });

  it("returns the same team object", async () => {
    nextWord.mockResolvedValue({
      _nextWord: "kiwi",
      nextExplainer: { _id: { toString: () => "user2" } },
    });

    const result = await nextRound(team);
    expect(result).toBe(team);
  });
});
