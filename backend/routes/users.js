const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  logout,
} = require('../controllers/users');

const {
  validateUserId,
  validateAvatar,
  validateSignIn,
} = require('../middlewares/validator-check');

router.get('/', getUsers);
router.get('/:userId', validateUserId('typeOfId:userId'), getUser);
router.patch('/me', validateSignIn, updateUser);
router.patch('/me/avatar', validateAvatar, updateAvatar);
router.delete('/signout', logout);

module.exports = router;
