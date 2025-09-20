const express = require('express');
const router = express.Router();
const invCtrl = require('../controllers/investmentController');
const auth = require('../middlewares/authMiddleware');

router.post('/invest', auth, invCtrl.invest);
router.get('/portfolio', auth, invCtrl.getPortfolio);

module.exports = router;
