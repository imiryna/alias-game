const { HttpError } = require('../utils');
const { StatusCodes } = require("http-status-codes");

/**
 * Get the next explainer in a round-robin fashion from the list of players.
 *
 * @param players
 * @param currentIndex
 * @returns {{nextExplainer: ({_id}|*|{_id: *}), nextIndex: number}}
 */
exports.getNextExplainer = (players, currentIndex) => {
    if (!Array.isArray(players) || players.length === 0) {
        throw new HttpError(StatusCodes.NOT_FOUND, "No players in team");
    }

    const validIndex = typeof currentIndex === "number" ? currentIndex : -1;
    const nextIndex = (validIndex + 1) % players.length;
    const next = players[nextIndex];

    const nextExplainer =
        typeof next === "object" && next._id ? next : { _id: next };

    return { nextExplainer, nextIndex };
};
