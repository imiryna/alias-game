const { HttpError, getNextExplainer, pickRandomWord } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const gameService = require("./gameService");
const { getTeamById, getTeamByIdForRound } = require("./teamService");
const { getGameEmitter, getOnlineUsers } = require("../events/gameEmitter");

const { TEAM_STATUS } = require("../models");

const { setInterval } = require("timers/promises");

const gameOver = async (teamModel) => {
  teamModel.team_score = 0;
  teamModel.currentRound.number = 0;
  teamModel.status = TEAM_STATUS.ENDED;
  teamModel.player_list = [];
  teamModel.currentRound.is_active = false;
  await teamModel.save();

  const ge = getGameEmitter();
  ge.emit("game:over", { teamId: teamModel._id.toString() });
};

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

  if (team.player_list.length === 5) {
    team.isFull = true;
  }
  await team.save();

  return team;
};

exports.leftTeam = async (teamId, userId, socketId = null) => {
  const ge = getGameEmitter();
  const allUsers = getOnlineUsers();

  if (!userId) {
    for (const [user_id, id] of allUsers.entries()) {
      if (id === socketId) userId = user_id;
    }
  }

  const team = await getTeamById(teamId);
  if (!team) throw new HttpError(StatusCodes.NOT_FOUND, "Team is not exist");
  console.log(`team.player_list.leftTeam ${team.player_list}`);
  team.player_list = team.player_list.filter((pl) => pl._id.toString() !== userId);
  await team.save();

  if (team.currentExplainer?.toString() === userId.toString()) {
    team.currentExplainer = null;
    await team.save();
  }
  // io.to(team._id.toString()).emit("userLeft", { userId });

  ge.emit("team:playerLeft", { teamId, userId });

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

exports.switchExplainer = async (team) => {
  const ge = getGameEmitter();
  let a = await nextWord(team);

  const socketId = getOnlineUsers().get(a.nextExplainer._id.toString());
  ge.emit("chat:newExplainer", { teamId: team._id.toString(), explainer: socketId, word: a._nextWord });

  const updateFields = {
    currentRound: {
      is_active: true,
      current_word: a._nextWord,
    },
    currentExplainer: a.nextExplainer,
  };
  ge.emit("updateTeam", { teamId: team._id.toString(), updateFields });
};

const innerNextRound = async (teamId) => {
  const team = await getTeamByIdForRound(teamId);
  const currentRound = team.currentRound.number;

  const ge = getGameEmitter();
  if (!Array.isArray(team.player_list) || team.player_list.length === 0) {
    throw new HttpError(StatusCodes.NOT_FOUND, "No players in team");
  }

  // Check if rounds off - game over
  if (currentRound <= team.game.settings.round_amount) {
    await this.switchExplainer(team);

    timerTick(team);

    const newRoundNumber = team.currentRound.number + 1;
    const updateFields = {
      currentRound: {
        number: newRoundNumber,
      },
    };
    ge.emit("updateTeam", { teamId: team._id.toString(), updateFields });
  } else {
    await gameOver(team);
  }
  return team;
};

const timerTick = (team) => {
  const ge = getGameEmitter();
  const teamId = team._id.toString();

  let roundTime = team.game.settings.round_time;

  const interval = 1000; // 1 second

  (async function () {
    for await (const step of setInterval(interval, Date.now())) {
      console.log(step);

      ge.emit("team:roundTimerTick", { teamId, remaining: roundTime });
      roundTime -= 1;
      if (roundTime <= 0) {
        ge.emit("team:roundEnded", { teamId, round: team.currentRound });
        innerNextRound(team);
        break;
      }
    }
  })();
  return interval;
};

exports.nextRound = async (teamId) => innerNextRound(teamId);
