const { ChatModel } = require("../models");
let io;

exports.initChatSocket = (socketIoInstance) => {
  io = socketIoInstance;
};

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

exports.createNewMessage = async ({ userId, teamId, message }) => {
  const chat = await ChatModel.findOne({ team_id: teamId });
  if (!chat) throw new Error("Chat not found");

  const newMessage = { user: userId, text: message, timestamp: new Date() };
  chat.messages.push(newMessage);
  await chat.save();

  io.to(teamId).emit("newMessage", newMessage);

  return newMessage;
};
