const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { runCode, submitCode } = require('../controllers/codeRunnerController');

router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);

module.exports = router;
