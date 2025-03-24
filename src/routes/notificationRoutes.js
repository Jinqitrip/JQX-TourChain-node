const router = require('express').Router();
const { check } = require('express-validator');
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', 
  authenticateToken,
  [
    check('status').optional().isIn(['unread', 'read', 'all']),
    check('page').optional().isInt({ min: 1 }),
    check('page_size').optional().isInt({ min: 1 })
  ],
  notificationController.getNotifications
);

module.exports = router;