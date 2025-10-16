const { model, Schema } = require("mongoose");

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    // 👇 current explainer must be one of the players
    current_explainer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: function (value) {
          // ensure explainer belongs to player_list
          return !value || this.player_list.some((id) => id.equals(value));
        },
        message: "Current explainer must be one of the team's players",
      },
    },
  },
  { timestamps: true }
);

const TeamModel = model("team", teamSchema);

module.exports = TeamModel;
