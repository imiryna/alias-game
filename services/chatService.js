const { ChatModel, TeamModel } = require("../models");
const { HttpError } = require("../helpers");
const { StatusCodes } = require("http-status-codes");
const { isWordTooSimilar, checkGuess } = require("../utils");
const { getUserById } = require("./userService");
const { switchExplainer } = require("./logicGameService");

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
 * Check a new message in the chat
 *
//  * @param userId
//  * @param teamId
//  * @param message
//  * @returns {Promise<{text, user, timestamp: Date}>}
//  */
exports.checkingMessageFn = async ({ teamId, newMessage }) => {
  const messagePool = {};
  const team = await TeamModel.findById(teamId);
  const user = newMessage.user;
  const userId = user._id.toString();
  console.log(String(userId));
  if (!team) throw new HttpError(StatusCodes.NOT_FOUND, "Team not found");

  const { currentExplainer, currentRound } = team;
  console.log(String(currentExplainer));
  console.log(currentRound);
  // if game is already started
  if (currentRound?.is_active && currentRound?.current_word) {
    // if message author is explainer
    if (String(userId) === String(currentExplainer)) {
      const words = newMessage.text.trim().split(/\s+/).filter(Boolean);

      const hasSimilarWord = words.some((word) => isWordTooSimilar(word, team.currentRound.current_word));
      if (hasSimilarWord) {
        // send message back to the explainer only

        messagePool["chat:newPMMessage"] = {
          userId: userId,
          message: "Your message is too similar to the word to guess!",
        };
      }
    } else {
      // if the message author not explainer, he guess the words
      const isCorrect = checkGuess(newMessage.text, currentRound.current_word);
      if (isCorrect) {
        const messageAuthor = await getUserById(userId);
        messagePool["updateUser"] = { userId, updateFields: { stat: messageAuthor.stat + 1 } };

        // increaseUserStats(userId); // update user stats
        messagePool["chat:sysMessage"] = {
          teamId,
          message: `${messageAuthor.name} guessed the word: ${currentRound.current_word}`,
        };

        // team score update
        messagePool["updateTeam"] = {
          teamId: teamId,
          updateFields: { team_score: team.team_score + 1 },
        };
        switchExplainer(team);
      }
    }
  }
  messagePool["chat:newMessage"] = {
    teamId,
    message: newMessage,
  };
  return messagePool;
};
