const router = require('express').Router();
const { check } = require('express-validator');
const recommendationController = require('../controllers/recommendationController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', 
  authenticateToken,
  [
    check('category').optional().isIn(['hotel', 'route', 'tour']),
    check('limit').optional().isInt({ min: 1 })
  ],
  recommendationController.getRecommendations
);

module.exports = router;