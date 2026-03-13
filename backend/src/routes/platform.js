const router = require('express').Router();
const { getGlobalStats } = require('../controllers/platformController');

router.get('/stats', getGlobalStats);

module.exports = router;
