const { model, Schema } = require("mongoose");
const { GAME_STATUS } = require("./constants");

const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Game name is required"],
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "user",
      //required: [true, "Game must have an admin (owner)"],
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "team",
        required: false, // default teams can be created on game start
      },
    ],
    word_vocabulary: [
      {
        type: String,
        required: false,
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
      round_amount: {
        type: Number,
        default: 10, // number of words per game
      },
    },
    status: {
      type: String,
      enum: GAME_STATUS, //all possible states
      default: GAME_STATUS.WAITING,
    },
  },
  { timestamps: true }
);

const GameModel = model("game", gameSchema);

module.exports = GameModel;
