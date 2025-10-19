const chatService = require("../services/chatService");
const { catchAsync, HttpError } = require("../utils");

// to get a chat by team ID
exports.getChatByTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;

  const chat = await chatService.getChatByTeam(teamId);

  if (!chat) {
    throw new HttpError(404, "Chat not found for this team");
  }

  res.status(200).json(chat);
});

// to create a chat for a team
exports.createChatForTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;

  const chat = await chatService.createChatForTeam(teamId);

  if (!chat) {
    throw new HttpError(400, "Chat for this team already exists");
  }

  res.status(201).json({
    message: "Chat created successfully",
    chat,
  });
});
