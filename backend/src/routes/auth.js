const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
router.post('/password/request-reset', authCtrl.requestPasswordReset);
router.post('/password/reset', authCtrl.verifyOtpAndReset);

module.exports = router;
