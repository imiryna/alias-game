const { model, Schema } = require("mongoose");

const gameSchema = new Schema({
  /* Game
- list of teams: []; (2 default teams with generated name)
- word vocabulary 
- settings:{
  - round time
  - word amount
}

- name of the game
- admin of the game */
});

const GameModel = model("game", gameSchema);

module.exports = GameModel;
