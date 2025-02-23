const orderService = require('../services/orderService');
const { handleError } = require('./authController');

module.exports = {
  async createOrder(req, res) {
    try {
      const userId = req.user.sub;
      const { type, resource_id, quantity, contact_info } = req.body;
      const data = await orderService.createOrder(userId, { type, resource_id, quantity, contact_info });
      res.status(201).json({ code: 201, data });
    } catch (error) {
      handleError(res, error);
    }
  },

  async getOrderStatus(req, res) {
    try {
      const { order_id } = req.params;
      const userId = req.user.sub;
      const data = await orderService.getOrderStatus(order_id, userId);
      res.status(200).json({ code: 200, data });
    } catch (error) {
      if (error.code === 'FORBIDDEN') {
        res.status(403).json({ code: 403, message: '无权访问此订单' });
      } else {
        handleError(res, error);
      }
    }
  }
};