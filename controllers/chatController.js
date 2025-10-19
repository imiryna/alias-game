const ChatModel = require("../models");
const { catchAsync, HttpError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

// to get chat by team ID
exports.getChatByTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;

  const chat = await ChatModel.findOne({ team_id: teamId }).populate("messages.user", "username email").populate("explainer", "username email");

  if (!chat) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Chat not found for this team");
  }

  res.status(StatusCodes.OK).json(chat);
});

// to create chat for a team
exports.createChatForTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;

  const existingChat = await ChatModel.findOne({ team_id: teamId });
  if (existingChat) {
    throw new HttpError(StatusCodes.BAD_REQUEST, "Chat for this team already exists");
  }

  const chat = await ChatModel.create({ team_id: teamId, messages: [] });

  res.status(StatusCodes.CREATED).json({
    message: "Chat created",
    chat,
  });
});
