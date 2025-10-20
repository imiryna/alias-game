const { ChatModel } = require("../models");

// to get a chat by team ID
exports.getChatByTeam = async (teamId) => {
  return await ChatModel.findOne({ team_id: teamId }).populate("messages.user", "username email").populate("explainer", "username email");
};

// to create a chat for a team
exports.createChatForTeam = async (teamId) => {
  // check if chat already exists
  const existingChat = await ChatModel.findOne({ team_id: teamId });
  if (existingChat) {
    return null; //
  }

  // to create a new chat
  return await ChatModel.create({
    team_id: teamId,
    messages: [],
  });
};
