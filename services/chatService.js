const { ChatModel, TeamModel } = require("../models");
const { getGameEmitter, getOnlineUsers } = require("../events/gameEmitter");
const { checkGuess, isWordTooSimilar } = require("../utils");
const { getUserById, increaseUserStats } = require("./userService");

/**
 * Get chat messages by team ID
 *
 * @param teamId
 * @returns {Promise<*>}
 */
exports.getChatByTeam = async (teamId) => {
  const chatHistory = await ChatModel.findOne({ team_id: teamId }).populate("messages.user", "name");
  return chatHistory.messages;
};

/**
 * Create a new chat for a team
 *
 * @param teamId
 * @returns {Promise<null|*>}
 */
exports.createChatForTeam = async (teamId) => {
  // check if chat already exists
  const existingChat = await ChatModel.findOne({ team_id: teamId });
  if (existingChat) {
    return null;
  }

  // to create a new chat
  return await ChatModel.create({
    team_id: teamId,
    messages: [],
  });
};

/**
 * Create a new message in the chat
 *
 * @param userId
 * @param teamId
 * @param message
 * @returns {Promise<{text, user, timestamp: Date}>}
 */
exports.createNewMessage = async ({ userId, teamId, message }) => {
  let ge = getGameEmitter();
  // const chat = await ChatModel.findOne({ team_id: teamId });
  // if (!chat) throw new Error("Chat not found");

  const team = await TeamModel.findById(teamId);
  if (!team) throw new Error("Team not found");

  const { currentExplainer, currentRound } = team;

  if (currentRound?.is_active && currentRound?.current_word) {
    if (String(userId) === String(currentExplainer)) {
      const words = message.trim().split(/\s+/).filter(Boolean);
      const hasSimilarWord = words.some((word) => isWordTooSimilar(word, team.currentRound.current_word));
      if (hasSimilarWord) {
        // send message back to the explainer only

        //   message: "Your message is too similar to the word to guess!",

        ge.emit("chat:newPMMessage", {
          socketId: getOnlineUsers()[userId],
          message: "Your message is too similar to the word to guess!",
        });
        return;
      }
    } else {
      const isCorrect = checkGuess(message, currentRound.current_word);
      if (isCorrect) {
        const messageAuthor = await getUserById(userId);

        increaseUserStats(userId); // update user stats

        ge.emit("chat:sysMessage", {
          teamId,
          message: `${messageAuthor.name} guessed the word: ${currentRound.current_word}`,
        });

        // team score update
        // TODO uncomment
        //ge.emit("updateTeam", { teamId: teamId, updateFields: { team_score: team.team_score + 1 } });

        return;
      }
    }
  }

  // const newMessage = { user: userId, text: message, timestamp: new Date() };
  // chat.messages.push(newMessage);
  // await chat.save();

  ge.emit("chat:sysMessage", { teamId, message: newMessage });
  // io.to(teamId).emit("newMessage", newMessage);

  return newMessage;
};
