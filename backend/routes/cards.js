const router = require('express').Router();
const {
  validateCard,
  validateCardId,
} = require('../middlewares/validator-check');

const {
  getCard,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');

router.get('/', getCard);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateCardId('typeOfId:cardId'), deleteCard);
router.put('/:cardId/likes', validateCardId('typeOfId:cardId'), likeCard);
router.delete('/:cardId/likes', validateCardId('typeOfId:cardId'), dislikeCard);

module.exports = router;
