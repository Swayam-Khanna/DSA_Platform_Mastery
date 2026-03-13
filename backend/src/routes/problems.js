const router = require('express').Router();
const { protect, requireAdmin } = require('../middleware/auth');
const {
    getProblems, getProblem, createProblem, updateProblem, deleteProblem, submitSolution
} = require('../controllers/problemController');

const optionalAuth = (req, res, next) => {
    const auth = require('../middleware/auth');
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            User.findById(decoded.id).select('-password').then(user => {
                req.user = user;
                next();
            });
        } catch { next(); }
    } else { next(); }
};

router.get('/', optionalAuth, getProblems);
router.get('/:id', optionalAuth, getProblem);
router.post('/', protect, requireAdmin, createProblem);
router.put('/:id', protect, requireAdmin, updateProblem);
router.delete('/:id', protect, requireAdmin, deleteProblem);
router.post('/:id/submit', protect, submitSolution);

module.exports = router;
