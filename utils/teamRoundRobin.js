// Get the next explainer in a round-robin fashion from the list of players.

const getNextExplainer = (players, currentExplainer) => {
  let explainer = null;

  if (!currentExplainer) {
    explainer = players[0];
  }

  const nextIndex = players.indexof(currentExplainer);
  const nextExpl = (nextIndex + 1) % players.length;

  return { explainer, nextExpl };
};

module.exports = getNextExplainer;
