const router = require('express').Router();
const { check } = require('express-validator');
const buddyController = require('../controllers/buddyController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 搭子需求提交
router.post('/submit', 
  authenticateToken,
  [
    check('destination').notEmpty(),
    check('start_date').isISO8601(),
    check('people_num').isInt({ min: 1 }),
    check('budget').isInt({ min: 0 }),
    check('interests').isArray()
  ],
  buddyController.submitRequirement
);

// 搭子帖子列表查询
router.get('/posts', 
  [
    check('page').optional().isInt({ min: 1 }),
    check('page_size').optional().isInt({ min: 1 }),
    check('destination').optional().isString()
  ],
  buddyController.getPosts
);

module.exports = router;