const chatService = require("../services/chatService");
const { catchAsync, HttpError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

// to get a chat by team ID
exports.getChatByTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;

  const chat = await chatService.getChatByTeam(teamId);

  if (!chat) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Chat not found for this team");
  }

  res.status(StatusCodes.OK).json(chat);
});

// to create a chat for a team
exports.createChatForTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;

  const chat = await chatService.createChatForTeam(teamId);

  if (!chat) {
    throw new HttpError(StatusCodes.BAD_REQUEST, "Chat for this team already exists");
  }

  res.status(201).json({
    message: "Chat created successfully",
    chat,
  });
});
