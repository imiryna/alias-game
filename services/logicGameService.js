const { HttpError, getNextExplainer, pickRandomWord } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const gameService = require("./gameService");
const { getTeamById } = require("./teamService");
const { getIO, getGameEmitter } = require("../socketManager");

// Checking that the team is not already on another team in this game
const isTeamExist = async (teamId) => {
  const team = await getTeamById(teamId);
  return team;
};

exports.joinTeam = async (teamId, userId) => {
  const team = await isTeamExist(teamId);

  if (!team) throw new HttpError(StatusCodes.NOT_FOUND, "Team is not exist");

  const gameId = team.game._id;

  // Checking that the player is not already on another team in this game
  const userExist = await gameService.isPlayerInGame(gameId, userId);

  if (userExist) {
    throw new HttpError(StatusCodes.CONFLICT, "Player already in another team");
  }

  team.player_list.push(userId);
  await team.save();

  return team;
};

exports.leftTeam = async (teamId, userId) => {
  const io = getIO();
  const team = await getTeamById(teamId);
  if (!team) throw new HttpError(StatusCodes.NOT_FOUND, "Team is not exist");

  team.player_list = team.player_list.filter((pl) => pl._id.toString() !== userId);
  await team.save();

  if (team.currentExplainer?.toString() === userId.toString()) {
    team.currentExplainer = null;
    await team.save();
  }
  io.to(team._id.toString()).emit("userLeft", { userId });

  return team.populate("player_list");
};

/*
Each round can consist of few steps, if team guess words quickly, so 
the basic unit of game - function <nextWord> which take new Explainer,
new word. No checkings
*/
const nextWord = async (team) => {
  const nextExplainer = getNextExplainer(Array.from(team.player_list), team.currentExplainer);
  const _nextWord = pickRandomWord(team);
  return { nextExplainer, _nextWord };
};

exports.nextRound = async (team) => {
  const ge = getGameEmitter();
  if (!Array.isArray(team.player_list) || team.player_list.length === 0) {
    throw new HttpError(StatusCodes.NOT_FOUND, "No players in team");
  }

  let a = await nextWord(team);

  timerTick(team);

  const newRoundNumber = team.currentRound.number + 1;
  const updateFields = {
    currentRound: {
      number: newRoundNumber,
      isActive: true,
      current_word: a._nextWord,
    },
    currentExplainer: a.nextExplainer._id.toString(),
  };
  console.log(team._id.toString());
  ge.emit("updateTeam", { teamId: team._id.toString(), updateFields });

  return team;
};

const timerTick = (team) => {
  const io = getIO();
  const ge = getGameEmitter();
  const teamId = team._id.toString();

  let roundTime = 5; //team.game.settings.round_time;

  const interval = 1000; // 1 second

  (async function () {
    for await (const step of setInterval(interval, Date.now())) {
      // confusing ^^
      io.to(teamId).emit("roundTimerTick", { remaining: roundTime }); // timer updates
      roundTime -= 1;
      if (roundTime <= 0) {
        io.to(teamId).emit("roundEnded", { round: team.currentRound, teamId });
        break;
      }

      ge.emit("updateTeam", { teamId: teamId, updateFields: { currentRound: { isActive: false } } });
    }
  })();
  return interval;
};
