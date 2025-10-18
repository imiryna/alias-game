function getNextExplainer(playerList, currentIndex) {
    if (!playerList || playerList.length === 0) return null;

    const validIndex = typeof currentIndex === 'number' && currentIndex >= 0
        ? currentIndex
        : -1;

    const nextIndex = (validIndex + 1) % playerList.length;
    const nextPlayerId = playerList[nextIndex];

    return { nextIndex, nextPlayerId };
}

module.exports = { getNextExplainer };
