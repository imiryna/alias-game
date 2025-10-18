const { getNextExplainer } = require('../utils/teamRoundRobin');
const Team = require('../models/TeamModel');

async function chooseNextExplainer(teamId) {
    const team = await Team.findById(teamId).populate('player_list');
    if (!team) throw new Error("Team not found");

    const { nextExplainer, nextIndex } = getNextExplainer(team.player_list, team.currentExplainerIndex);

    team.currentExplainer = nextExplainer._id;
    team.currentExplainerIndex = nextIndex;

    await team.save();
    return team;
}

module.exports = {
    chooseNextExplainer,
};
