const { createNewMessage } = require("../services");
const { ChatModel, TeamModel } = require("../models");
const { getIO } = require("../socketManager");
const { isWordTooSimilar, checkGuess } = require("../utils");

jest.mock("../models", () => ({
  ChatModel: { findOne: jest.fn() },
  TeamModel: { findById: jest.fn() },
}));
jest.mock("../socketManager", () => ({
  getIO: jest.fn(),
}));
jest.mock("../utils", () => ({
  isWordTooSimilar: jest.fn(),
  checkGuess: jest.fn(),
}));

describe("createNewMessage", () => {
  let ioEmitMock;
  let mockChat;
  let mockTeam;

  beforeEach(() => {
      ioEmitMock = jest.fn().mockReturnValue({ emit: jest.fn() });
      getIO.mockReturnValue({ to: jest.fn(() => ({ emit: ioEmitMock })) });

  mockChat = {
      messages: [],
      save: jest.fn().mockResolvedValue(true),
  };
  mockTeam = {
    currentExplainer: "explainer123",
    currentRound: {
      is_active: true,
      current_word: "apple",
    },
    team_score: 0,
    save: jest.fn(),
  };

  ChatModel.findOne.mockResolvedValue(mockChat);
  TeamModel.findById.mockResolvedValue(mockTeam);

  jest.clearAllMocks();
  });

  test("throws if chat not found", async () => {
    ChatModel.findOne.mockResolvedValue(null);

    await expect(
      createNewMessage({ userId: "u1", teamId: "t1", message: "hi" })
    ).rejects.toThrow("Chat not found");
  });

  test("throws if team not found", async () => {
    TeamModel.findById.mockResolvedValue(null);

    await expect(
      createNewMessage({ userId: "u1", teamId: "t1", message: "hi" })
    ).rejects.toThrow("Team not found");
  });

  test("emits systemMessage if explainer sends a too-similar word", async () => {
    isWordTooSimilar.mockReturnValue(true);

    await createNewMessage({
      userId: "explainer123",
      teamId: "t1",
      message: "apples",
    });

    expect(ioEmitMock).toHaveBeenCalledWith("systemMessage", {
      message: "Your message is too similar to the word to guess!",
    });
    expect(mockChat.save).not.toHaveBeenCalled();
  });

  test("emits correctGuess and updates team if non-explainer guesses correctly", async () => {
    isWordTooSimilar.mockReturnValue(false);
    checkGuess.mockReturnValue(true);

    await createNewMessage({
      userId: "user456",
      teamId: "t1",
      message: "apple",
    });

    expect(ioEmitMock).toHaveBeenCalledWith("correctGuess", {
      message: "User guessed the word: apple",
      userId: "user456",
    });
    expect(mockTeam.team_score).toBe(1);
    expect(mockTeam.currentRound.is_active).toBe(false);
    expect(mockTeam.save).toHaveBeenCalled();
  });

  test("saves and emits normal message when nothing special happens", async () => {
    isWordTooSimilar.mockReturnValue(false);
    checkGuess.mockReturnValue(false);

    await createNewMessage({
      userId: "explainer123",
      teamId: "t1",
      message: "some hint",
    });

    expect(mockChat.messages).toHaveLength(1);
    expect(mockChat.save).toHaveBeenCalled();
    expect(ioEmitMock).toHaveBeenCalledWith("newMessage", expect.any(Object));
  });
});