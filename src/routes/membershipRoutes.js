const router = require('express').Router();
const { check } = require('express-validator');
const membershipController = require('../controllers/membershipController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 会员等级与权益查询
router.get('/level', authenticateToken, membershipController.getMembershipLevel);

// 积分流水查询
router.get('/pointsHistory', 
  authenticateToken,
  [
    check('page').optional().isInt({ min: 1 }),
    check('page_size').optional().isInt({ min: 1 })
  ],
  membershipController.getPointsHistory
);

// 积分兑换优惠券
router.post('/redeem',
  authenticateToken,
  [
    check('coupon_id').notEmpty(),
    check('quantity').isInt({ min: 1 })
  ],
  membershipController.redeemCoupon
);

module.exports = router;