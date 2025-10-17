const { checkSignupData } = require("./authMiddleware");
const { signupAuthDataValidator, loginAuthDataValidator } = require("./validateAuth");
const { createUserDataValidator, updateUserDataValidator } = require("./validateUser");
const { createTeamDataValidator } = require("./validateTeam");

module.exports = {
  checkSignupData,
  signupAuthDataValidator,
  loginAuthDataValidator,
  createUserDataValidator,
  updateUserDataValidator,
  createTeamDataValidator,
};
