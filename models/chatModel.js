const { model, Schema } = require("mongoose");

const chatSchema = new Schema({
  //    Chat
  //   -  team_id
  //   - current_word_to_guess(target_word)
  //   - Messages
  //   - timestamps
  //   - explainer
});

const ChatModel = model("chat", chatSchema);

module.exports = ChatModel;
