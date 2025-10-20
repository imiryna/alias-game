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
      ref: "User", // reference to players
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
  current_round: {
    number: { type: Number, default: 1 }, // round counter
    // active_team: { type: Schema.Types.ObjectId, ref: "Team" },
    current_word: { type: String }, // word currently being guessed
    is_active: { type: Boolean, default: false }, // whether the round is ongoing
  },
});

const TeamModel = model("game", teamSchema);

module.exports = TeamModel;
