const ChatModel = require("../models/chatModel");
const { catchAsync, HttpError } = require("../utils");

// to get chat by team ID
exports.getChatByTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;

  const chat = await ChatModel.findOne({ team_id: teamId })
    .populate("messages.user", "username email")
    .populate("explainer", "username email");

  if (!chat) {
    throw new HttpError(404, "Chat not found for this team");
  }

  res.status(200).json(chat);
});

// to create chat for a team
exports.createChatForTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;

  const existingChat = await ChatModel.findOne({ team_id: teamId });
  if (existingChat) {
    throw new HttpError(400, "Chat for this team already exists");
  }

  const chat = await ChatModel.create({ team_id: teamId, messages: [] });

  res.status(201).json({
    message: "Chat created",
    chat,
  });
});
