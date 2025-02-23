const notificationService = require('../services/notificationService');
const { handleError } = require('./authController');

module.exports = {
  async getNotifications(req, res) {
    try {
      const { status = 'all', page = 1, page_size = 10 } = req.query;
      const userId = req.user.sub;
      const data = await notificationService.getNotifications(userId, status, parseInt(page), parseInt(page_size));
      res.status(200).json({ code: 200, data });
    } catch (error) {
      handleError(res, error);
    }
  }
};