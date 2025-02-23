const membershipService = require('../services/membershipService');
const pointsService = require('../services/pointsService');
const { handleError } = require('./authController');

module.exports = {
  async getMembershipLevel(req, res) {
    try {
      const userId = req.user.sub;
      const data = await membershipService.getMembershipLevel(userId);
      res.status(200).json({ code: 200, data });
    } catch (error) {
      handleError(res, error);
    }
  },

  async getPointsHistory(req, res) {
    try {
      const userId = req.user.sub;
      const { page = 1, page_size = 10 } = req.query;
      const data = await membershipService.getPointsHistory(userId, parseInt(page), parseInt(page_size));
      res.status(200).json({ code: 200, data });
    } catch (error) {
      handleError(res, error);
    }
  },

  async redeemCoupon(req, res) {
    try {
      const userId = req.user.sub;
      const { coupon_id, quantity } = req.body;
      const result = await pointsService.redeemCoupon(userId, coupon_id, quantity);
      res.status(200).json({ code: 200, message: '兑换成功', data: result });
    } catch (error) {
      if (error.code === 'INSUFFICIENT_POINTS') {
        res.status(403).json({ code: 403, ...error });
      } else if (error.code === 'CONFLICT') {
        res.status(409).json({ code: 409, message: error.message });
      } else {
        handleError(res, error);
      }
    }
  }
};