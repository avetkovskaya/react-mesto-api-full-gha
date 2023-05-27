const jsonwebtoken = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jsonwebtoken.verify(jwt, 'some-secret-key');
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
