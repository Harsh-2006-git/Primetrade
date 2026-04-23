const Joi = require("joi");

const createTask = Joi.object({
  title: Joi.string().required().trim().min(3).max(100),
  description: Joi.string().required().min(10),
  status: Joi.string().valid("pending", "in-progress", "completed").default("pending"),
  priority: Joi.string().valid("low", "medium", "high").default("low"),
  dueDate: Joi.date().required().greater("now"),
});

const updateTask = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  description: Joi.string().min(10),
  status: Joi.string().valid("pending", "in-progress", "completed"),
  priority: Joi.string().valid("low", "medium", "high"),
  dueDate: Joi.date().greater("now"),
}).min(1);

module.exports = { createTask, updateTask };
