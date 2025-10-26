const { getChatByTeam, createChatForTeam, createNewMessage } = require("../services");
const { catchAsync, HttpError } = require("../utils");
const { StatusCodes } = require("http-status-codes");

// to get a chat by team ID
exports.getChatByTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;

  const chat = await getChatByTeam(teamId);

  if (!chat) {
    throw new HttpError(StatusCodes.NOT_FOUND, "Chat not found for this team");
  }

  res.status(StatusCodes.OK).json(chat);
});

// to create a chat for a team
exports.createChatForTeam = catchAsync(async (req, res) => {
  const { teamId } = req.params;

  const chat = await createChatForTeam(teamId);

  if (!chat) {
    throw new HttpError(StatusCodes.BAD_REQUEST, "Chat for this team already exists");
  }

  res.status(201).json({
    message: "Success",
    chat,
  });
});

exports.sendMessageToTeam = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const teamId = req.body.teamId;
  const message = req.body.message;

  const m = createNewMessage({ userId, teamId, message });

  res.status(200).json({
    message: "Success",
    text: m,
  });
});
