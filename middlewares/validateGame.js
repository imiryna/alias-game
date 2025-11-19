const Joi = require("joi");

exports.createGameSchema = (data) =>
  Joi.object({
    name: Joi.string().min(3).max(50).messages({
      "string.empty": "Game name cannot be empty",
      "string.min": "Game name must be at least 3 characters long",
    }),

    settings: Joi.object({
      round_time: Joi.number().integer().min(10).max(100).default(60),
      word_amount: Joi.number().integer().min(1).max(50).default(10),
      round_amount: Joi.number().integer().min(5).max(10).default(10),
    }).default(),
  }).validate(data, { abortEarly: false });

exports.createTeamIdValidator = (data) =>
  Joi.object({
    teamId: Joi.string().hex().length(24).required(), // ObjectId from MongoDB
  }).validate(data);
