const Joi = require("joi");

exports.createTeamDataValidator = (data) =>
  Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "any.required": "Missing required team name field",
    }),
    player_list: Joi.array()
      .items(Joi.string().hex().length(24)) // MongoDB ObjectIds
      .min(1)
      .messages({
        "array.min": "Team must have at least one player",
        "array.includes": "Invalid player ID format",
      }),
    team_score: Joi.number().min(0).default(0),
    current_explainer: Joi.string().hex().length(24).messages({ "string.hex": "Invalid user ID for explainer" }),
  }).validate(data);
