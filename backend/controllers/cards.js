const BadReqError = require('../errors/badreq-error');
const NotFound = require('../errors/notfound-error');
const Forbidden = require('../errors/forbidden-error');
const Cards = require('../models/cards');

const {
  INCORRECT_INFO,
  NOT_FOUND_ID,
  NO_PERMISSION_DELETE,
} = require('../errors/messages-error');

module.exports.getCard = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const personalId = req.user._id;

  Cards.create({ name, link, owner: personalId })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadReqError(INCORRECT_INFO));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFound(NOT_FOUND_ID))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError(INCORRECT_INFO));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFound(NOT_FOUND_ID))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError(INCORRECT_INFO));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .orFail(() => new NotFound(NOT_FOUND_ID))
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        return card
          .remove()
          .then(() => res.send({ message: 'Карточка удалена' }));
      }
      return next(new Forbidden(NO_PERMISSION_DELETE));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFound(INCORRECT_INFO));
      } else {
        next(err);
      }
    });
};
