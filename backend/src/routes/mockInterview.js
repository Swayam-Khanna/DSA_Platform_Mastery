const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { startMockInterview, submitMockInterview, getMockHistory } = require('../controllers/mockInterviewController');

router.post('/start', protect, startMockInterview);
router.post('/:id/submit', protect, submitMockInterview);
router.get('/history', protect, getMockHistory);

module.exports = router;
