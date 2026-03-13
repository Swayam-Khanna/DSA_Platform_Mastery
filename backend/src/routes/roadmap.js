const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getRoadmap } = require('../controllers/roadmapController');

router.get('/', protect, getRoadmap);

module.exports = router;
