const Joi = require('joi');

const eventSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  dateTime: Joi.date().iso().greater('now').required(),
  location: Joi.string().min(1).max(255).required(),
  capacity: Joi.number().integer().min(1).max(1000).required()
});

const userSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().required()
});

const registrationSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  eventId: Joi.number().integer().positive().required()
});

const validateEvent = (req, res, next) => {
  const { error } = eventSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateRegistration = (req, res, next) => {
  const { error } = registrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateEvent,
  validateUser,
  validateRegistration
};