const { checkUserExists } = require("../services");
const { catchAsync, HttpError } = require("../utils");
const { signupAuthDataValidator } = require("./validateAuth");

exports.checkSignupData = catchAsync(async (req, res, next) => {
  const { value, error } = signupAuthDataValidator.validate(req.body);

  if (error) {
    throw new HttpError(400, "Invalid user data..", error);
  }
  await checkUserExists({ email: value.email });

  req.body = value;

  next();
});
