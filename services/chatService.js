const { ChatModel } = require("../models");
const { getIO } = require("../socketManager");

// to get a chat by team ID
exports.getChatByTeam = async (teamId) => {
  const chatHistory = await ChatModel.findOne({ team_id: teamId }).populate("messages.user", "name");
  return chatHistory.messages;
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
  let io = getIO();
  const chat = await ChatModel.findOne({ team_id: teamId });
  if (!chat) throw new Error("Chat not found");

  // todo check message for synonyms (as explaner) (A)
  // todo check message for guess the word (A)
  // todo check if a new user connect - get all history chat (A)

  const newMessage = { user: userId, text: message, timestamp: new Date() };
  chat.messages.push(newMessage);
  await chat.save();

  io.to(teamId).emit("newMessage", newMessage);

  return newMessage;
};
