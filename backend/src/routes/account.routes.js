const express = require('express');

const {balance, transfer} = require('../controllers/account.controller');
const {authMiddleware} = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/balance').get(authMiddleware, balance);
router.route('/transfer').post(authMiddleware, transfer);

module.exports = router;