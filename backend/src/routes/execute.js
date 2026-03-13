const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { submitCode } = require('../controllers/executeController');

// All execution routes require authentication
router.post('/submit', protect, submitCode);

module.exports = router;
