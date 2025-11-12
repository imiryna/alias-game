/**
 * Get the next explainer in a round-robin fashion
 *
 * @param players
 * @param currentExplainer
 * @returns {*}
 */
exports.getNextExplainer = (players, currentExplainer) => {
  let explainer = null;
  let explainerIndex = null;
  const playersIndexs = players.map((p) => p._id.toString());

  if (!currentExplainer) {
    explainer = players[0];
  } else {
    const nextIndex = playersIndexs.indexOf(currentExplainer._id.toString());
    explainerIndex = (nextIndex + 1) % playersIndexs.length;
    explainer = players[explainerIndex];
  }

  return explainer;
};
