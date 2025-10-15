const { model, Schema } = require("mongoose");

const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Game name is required"],
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Game must have an admin (owner)"],
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: false, // default teams can be created on game start
      },
    ],
    word_vocabulary: [
      {
        type: String,
      },
    ],
    settings: {
      round_time: {
        type: Number,
        default: 60, // seconds per round
      },
      word_amount: {
        type: Number,
        default: 10, // number of words per game
      },
    },
    current_round: {
      number: { type: Number, default: 1 }, // round counter
      active_team: { type: Schema.Types.ObjectId, ref: "Team" }, // whose turn it is
      current_word: { type: String }, // word currently being guessed
      is_active: { type: Boolean, default: false }, // whether the round is ongoing
    },
  },

  { timestamps: true }
);

const GameModel = model("game", gameSchema);

module.exports = GameModel;
