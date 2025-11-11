const { model, Schema } = require("mongoose");
const { TEAM_STATUS } = require("./constants");

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  game: { type: Schema.Types.ObjectId, ref: "game" },
  player_list: [
    {
      type: Schema.Types.ObjectId,
      ref: "user", // reference to players
    },
  ],
  team_score: {
    type: Number,
    default: 0,
  },
  currentExplainer: {
    type: Schema.Types.ObjectId,
    ref: "user",
    default: null,
  },
  currentRound: {
    number: { type: Number, default: 0 }, // round counter
    current_word: { type: String }, // word currently being guessed
    is_active: { type: Boolean, default: false }, // whether the round is ongoing
  },
  word_vocabulary: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    enum: TEAM_STATUS, //all possible states
    default: TEAM_STATUS.WAITING,
  },
  isFull: {
    type: Boolean,
    default: false,
  },
});

const TeamModel = model("team", teamSchema);

module.exports = { TeamModel };
