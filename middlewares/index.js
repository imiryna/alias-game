const { checkSignupData, protected, checkLoginData } = require("./authMiddleware");
const { signupAuthDataValidator, loginAuthDataValidator } = require("./validateAuth");
const { validateTeamId } = require("./logicGameMiddleware");

module.exports = {
  checkSignupData,
  checkLoginData,
  protected,
  signupAuthDataValidator,
  loginAuthDataValidator,
  validateTeamId,
};
