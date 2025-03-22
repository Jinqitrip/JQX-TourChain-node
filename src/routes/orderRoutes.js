const router = require('express').Router();
const { check } = require('express-validator');
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 订单创建
router.post('/create', 
  authenticateToken,
  [
    check('type').isIn(['hotel', 'flight', 'route', 'car']),
    check('resource_id').notEmpty(),
    check('quantity').isInt({ min: 1 }),
    check('contact_info.name').notEmpty(),
    check('contact_info.mobile').isMobilePhone('zh-CN')
  ],
  orderController.createOrder
);

// 订单查询
router.get('/:order_id', 
  authenticateToken,
  orderController.getOrderStatus
);

module.exports = router;