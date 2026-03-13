const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getLeaderboard } = require('../controllers/leaderboardController');

const optionalAuth = (req, res, next) => {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            User.findById(decoded.id).select('-password').then(user => { req.user = user; next(); });
        } catch { next(); }
    } else { next(); }
};

router.get('/', optionalAuth, getLeaderboard);

module.exports = router;
