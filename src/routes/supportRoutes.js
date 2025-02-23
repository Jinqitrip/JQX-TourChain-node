const router = require('express').Router();
const { check } = require('express-validator');
const supportController = require('../controllers/supportController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/tickets', 
  authenticateToken,
  [
    check('type').isIn(['payment', 'refund', 'technical']),
    check('title').notEmpty(),
    check('content').notEmpty(),
    check('images').optional().isArray()
  ],
  supportController.createTicket
);

router.get('/tickets/:ticket_id', 
  authenticateToken,
  supportController.getTicketStatus
);

module.exports = router;