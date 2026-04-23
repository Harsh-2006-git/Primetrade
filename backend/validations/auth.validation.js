const Joi = require("joi");

const register = Joi.object({
  fullName: Joi.string().required().min(3).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8).pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).message('Password must be 8-30 characters and alphanumeric'),
  role: Joi.string().valid("user", "admin").default("user"),
});

const login = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

module.exports = { register, login };
