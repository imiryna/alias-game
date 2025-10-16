const { model, Schema } = require("mongoose");

const chatSchema = new Schema(
  {
    team_id: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    current_word_to_guess: {
      type: String,
      required: false, // optional, can be empty until the game starts
    },
    messages: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

const ChatModel = model("chat", chatSchema);

module.exports = ChatModel;
