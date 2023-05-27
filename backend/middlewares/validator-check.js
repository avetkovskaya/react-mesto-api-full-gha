const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { ValidationURL } = require('../index');

const validateLink = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неверный URL');
  }
  return value;
};

const validateString = Joi.string().min(2).max(30);
const validateEmail = Joi.string().email().required();
const validatePassword = Joi.string().required();
const validateBody = (keys) => Joi.object().keys(keys);

const validateUser = celebrate({
  body: validateBody({
    name: validateString.required(),
    about: validateString.required(),
  }),
});

const validateCard = celebrate({
  body: validateBody({
    name: validateString.required(),
    link: Joi.string().custom(validateLink).required(),
  }),
});

const validateUserId = (typeOfId) => celebrate({
  params: Joi.object().keys({
    [typeOfId]: Joi.string().hex().length(24),
  }),
});

const validateCardId = (typeOfId) => celebrate({
  params: Joi.object().keys({
    [typeOfId]: Joi.string().hex().length(24),
  }),
});

const validateAvatar = celebrate({
  body: validateBody({
    avatar: Joi.string().custom(validateLink).required().regex(ValidationURL),
  }),
});

const validateSignIn = celebrate({
  body: validateBody({
    email: validateEmail,
    password: validatePassword,
  }),
});

const validateSignUp = celebrate({
  body: validateBody({
    name: validateString,
    about: validateString,
    avatar: Joi.string().custom(validateLink).regex(ValidationURL),
    email: validateEmail,
    password: validatePassword,
  }),
});

module.exports = {
  validateUser,
  validateCard,
  validateCardId,
  validateUserId,
  validateAvatar,
  validateSignIn,
  validateSignUp,
};
