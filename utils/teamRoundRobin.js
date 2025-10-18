function getNextExplainer(players, currentIndex) {
    if (!players || players.length === 0) {
        throw new Error("No players in team");
    }

    const validIndex = typeof currentIndex === "number" ? currentIndex : -1;
    const nextIndex = (validIndex + 1) % players.length;
    const next = players[nextIndex];

    const nextExplainer = typeof next === "object" && next._id ? next : { _id: next };

    return { nextExplainer, nextIndex };
}

module.exports = { getNextExplainer };
