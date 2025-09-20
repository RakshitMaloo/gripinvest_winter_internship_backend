const express = require('express');
const router = express.Router();
const logCtrl = require('../controllers/logController');
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');

router.get('/', auth, admin, logCtrl.getLogsForUser);
router.get('/summary/:userId', auth, admin, logCtrl.summarizeErrorsForUser);

module.exports = router;
