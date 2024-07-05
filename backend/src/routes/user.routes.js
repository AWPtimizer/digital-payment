const express = require('express');
const router = express.Router();

const {signup, signin, updateUser, findUser} = require('../controllers/user.controller');
const {authMiddleware} = require('../middlewares/auth.middleware');

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/updateUser').put(authMiddleware, updateUser);
router.route('/bulk').get(findUser);

module.exports = router;