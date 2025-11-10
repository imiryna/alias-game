const Joi = require("joi");

// Auth validate
exports.signupAuthDataValidator = (data) =>
  Joi.object({
    username: Joi.string().min(2).max(255).required().messages({
      "any.only": "Missing required name field",
    }),
    email: Joi.string().email().required().messages({
      "any.only": "Missing required email field",
    }),
    password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  }).validate(data);

exports.loginAuthDataValidator = (data) =>
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }).validate(data);
