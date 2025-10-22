// Get the next explainer in a round-robin fashion from the list of players.

exports.getNextExplainer = (players, currentExplainer) => {
  let explainer = null;

  if (!currentExplainer) {
    explainer = players[0];
  } else {
    const nextIndex = players.indexof(currentExplainer);
    explainer = (nextIndex + 1) % players.length;
  }
  return explainer;
};
