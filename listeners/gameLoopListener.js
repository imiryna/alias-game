const { getGameEmitter } = require("../socketManager");
const { TeamModel } = require("../models");

exports.setupGameLoop = () => {
  const ge = getGameEmitter();

  ge.on("updateTeam", async ({ teamId, updateFields }) => {
    TeamModel.updateOne({ _id: teamId }, { $set: updateFields });
  });
};
