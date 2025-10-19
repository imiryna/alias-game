const { model, Schema } = require("mongoose");

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  game: { 
    type: Schema.Types.ObjectId,
    ref: "game" 
  },
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
});

const TeamModel = model("game", teamSchema);

module.exports = TeamModel;
