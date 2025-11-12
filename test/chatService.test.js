const { checkingMessageFn } = require("../services/chatService");
const { TeamModel} = require("../models");
const { getUserById } = require("../services/userService");
const { switchExplainer } = require("../services/logicGameService");
const { isWordTooSimilar, checkGuess } = require("../utils");
const { HttpError } = require("../helpers");

jest.mock("../models", () => ({
  TeamModel: {findById: jest.fn()},
}));

jest.mock("../services/userService", () => ({
  getUserById: jest.fn(),
}));

jest.mock("../services/logicGameService", () => ({
  switchExplainer: jest.fn(),
}));

jest.mock("../utils", () => ({
  isWordTooSimilar: jest.fn(),
  checkGuess: jest.fn(),
}));

describe("checkingMessageFn", () => {
  let mockTeam;
  let mockUser;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTeam = {
      currentExplainer: "explainer123",
      currentRound: {is_active: true, current_word: "apple"},
      team_score: 0,
    };

    mockUser = {
      _id: "user456",
      name: "Player",
      stat: 0,
    };

    TeamModel.findById.mockResolvedValue(mockTeam);
    getUserById.mockResolvedValue(mockUser);
  });

  test("throws if team not found", async () => {
    TeamModel.findById.mockResolvedValue(null);

    await expect(
      checkingMessageFn({teamId: "t1", newMessage: {user: mockUser, text: "hi"}})
    ).rejects.toThrow(HttpError);
  });

  test("emits system message if explainer sends a too-similar word", async () => {
    isWordTooSimilar.mockReturnValue(true);

    const messagePool = await checkingMessageFn({
      teamId: "t1",
      newMessage: {user: {_id: "explainer123"}, text: "apples"},
    });

    expect(messagePool["chat:newPMMessage"]).toEqual({
      userId: "explainer123",
      message: "Your message is too similar to the word to guess!",
    });
  });

  test("updates team and emits correct guess if non-explainer guesses correctly", async () => {
    isWordTooSimilar.mockReturnValue(false);
    checkGuess.mockReturnValue(true);

    const messagePool = await checkingMessageFn({
      teamId: "t1",
      newMessage: {user: {_id: "user456", name: "Player", stat: 0}, text: "apple"},
    });

    expect(messagePool["updateUser"]).toEqual({
      userId: "user456",
      updateFields: {stat: 1},
    });
    expect(messagePool["chat:sysMessage"]).toEqual({
      teamId: "t1",
      message: "Player guessed the word: apple",
    });
    expect(messagePool["updateTeam"]).toEqual({
      teamId: "t1",
      updateFields: {team_score: 1},
    });
    expect(switchExplainer).toHaveBeenCalled();
  });

  test("returns normal message if nothing special happens", async () => {
    isWordTooSimilar.mockReturnValue(false);
    checkGuess.mockReturnValue(false);

    const messagePool = await checkingMessageFn({
      teamId: "t1",
      newMessage: {user: {_id: "explainer123"}, text: "some hint"},
    });

    expect(messagePool["chat:newMessage"]).toEqual({
      teamId: "t1",
      message: {user: {_id: "explainer123"}, text: "some hint"},
    });
  });
});
