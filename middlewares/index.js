const { checkSignupData, checkLoginData } = require("./authMiddleware");
const { signupAuthDataValidator, loginAuthDataValidator } = require("./validateAuth");
const { createUserDataValidator, updateUserDataValidator } = require("./validateUser");
const { createTeamDataValidator } = require("./validateTeam");

module.exports = {
  checkSignupData,
  checkLoginData,
  signupAuthDataValidator,
  loginAuthDataValidator,
  createUserDataValidator,
  updateUserDataValidator,
  createTeamDataValidator,
};
const { checkSignupData } = require("./authMiddleware");

module.exports = {
  checkSignupData,
  authMiddleware,
};
