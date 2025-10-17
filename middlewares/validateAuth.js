const Joi = require("joi");

// Auth validate
exports.signupAuthDataValidator = (data) =>
  Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  }).validate(data);

exports.loginAuthDataValidator = (data) =>
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }).validate(data);
