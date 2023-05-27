const mongoose = require('mongoose');
const { isEmail, isURL } = require('validator');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь океана',
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: [isURL, 'Некорректный URL адрес.'],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, 'Некорректный email адрес.'],
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function auth(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new Unauthorized('Почта или пароль введены не верно'),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new Unauthorized('Почта или пароль введены не верно'),
          );
        }
        return user;
      });
    });
};
module.exports = mongoose.model('user', userSchema);
