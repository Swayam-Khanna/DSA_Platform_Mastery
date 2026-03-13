const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getQuestions, submitAssessment } = require('../controllers/assessmentController');

router.get('/questions/:language', getQuestions);
router.post('/submit', protect, submitAssessment);

module.exports = router;
