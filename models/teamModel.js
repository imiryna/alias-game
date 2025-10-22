const { model, Schema } = require("mongoose");

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
    number: { type: Number, default: 1 }, // round counter
    current_word: { type: String }, // word currently being guessed
    is_active: { type: Boolean, default: false }, // whether the round is ongoing
  },
});

const TeamModel = model("team", teamSchema);

module.exports = TeamModel;
