const { checkSignupData, protected } = require("./authMiddleware");
const { signupAuthDataValidator, loginAuthDataValidator } = require("./validateAuth");
const { createUserDataValidator, updateUserDataValidator } = require("./validateUser");
const { createTeamDataValidator } = require("./validateTeam");
const { createTeamIdValidator, createGameSchema } = require("./validateGame");
const { validateTeamId } = require("./logicGameMiddleware");

module.exports = {
  checkSignupData,
  protected,
  signupAuthDataValidator,
  loginAuthDataValidator,
  createUserDataValidator,
  updateUserDataValidator,
  createTeamDataValidator,
  createTeamIdValidator,
  createGameSchema,
  validateTeamId,
};
