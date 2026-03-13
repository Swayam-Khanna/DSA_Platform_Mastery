const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { explainProblem, getHint, debugCode, analyzeComplexity, reviewCode, chat } = require('../controllers/aiController');


router.post('/explain', protect, explainProblem);
router.post('/hint', protect, getHint);
router.post('/debug', protect, debugCode);
router.post('/complexity', protect, analyzeComplexity);
router.post('/review', protect, reviewCode);
router.post('/chat', protect, chat);


module.exports = router;
