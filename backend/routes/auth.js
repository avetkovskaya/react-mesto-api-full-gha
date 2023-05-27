const router = require('express').Router();
const { loginUser, createUser } = require('../controllers/users');
const {
  validateSignIn,
  validateSignUp,
} = require('../middlewares/validator-check');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, loginUser);

module.exports = router;
