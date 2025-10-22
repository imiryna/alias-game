const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

exports.createGameSchema = (data) =>
  Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      "string.empty": "Game name cannot be empty",
      "string.min": "Game name must be at least 3 characters long",
    }),

    adminId: Joi.string().custom(objectId).required().messages({
      "any.invalid": "Invalid adminId format",
      "any.required": "Game must have an adminId",
    }),

    settings: Joi.object({
      round_time: Joi.number().integer().min(10).max(300).default(60),
      word_amount: Joi.number().integer().min(1).max(100).default(10),
    }).default(),
  }).validate(data, { abortEarly: false });

exports.createTeamIdValidator = (data) =>
  Joi.object({
    teamId: Joi.string().hex().length(24).required(), // ObjectId из MongoDB
  }).validate(data);
