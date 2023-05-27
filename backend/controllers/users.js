const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Users = require('../models/users');
const BadReqError = require('../errors/badreq-error');
const KeyError = require('../errors/key-error');
const NotFound = require('../errors/notfound-error');

const NOT_FOUND = 'NotFound';
const CAST_ERROR = 'CastError';

module.exports = { NOT_FOUND, CAST_ERROR };

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((allUsers) => res.send(allUsers))
    .catch((err) => next(err));
};

module.exports.loginUser = (req, res, next) => {
  Users.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');

      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .status(200)
        .send({ user, message: 'Пользователь успешно авторизирован.' });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  Users.findById(req.params.userId)
    .orFail(() => new Error(NOT_FOUND))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        next(new BadReqError('Переданы некорректные данные при поиске пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => Users.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      const {
        name, about, avatar, email, _id,
      } = user;
      res.send({
        name,
        about,
        avatar,
        email,
        _id,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadReqError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new KeyError('Пользователь с таким эмейл уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((allUsers) => res.status(200).send(allUsers))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => Users.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => Users.findById(user._id).select('-password'))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadReqError('Переданы некорректные данные при поиске пользователя'));
      }
      if (err.code === 11000) {
        return next(new KeyError('Пользователь с таким эмейл уже существует'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  Users.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error(NOT_FOUND))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadReqError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFound('Пользователь с указанным _id не найден'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  Users.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error(NOT_FOUND))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadReqError('Переданы некорректные данные при поиске пользователя'));
      }
      if (err.message === NOT_FOUND) {
        return next(new NotFound('Пользователь с указанным _id не найден'));
      }
      return next(err);
    });
};

module.exports.logout = (req, res) => {
  res
    .clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    .send({ message: 'Вы вышли.' });
};
