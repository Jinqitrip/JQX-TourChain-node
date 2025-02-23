const supportService = require('../services/supportService');
const { handleError } = require('./authController');

module.exports = {
  async createTicket(req, res) {
    try {
      const userId = req.user.sub;
      const { type, title, content, images } = req.body;
      const data = await supportService.createTicket(userId, { type, title, content, images });
      res.status(201).json({ code: 201, message: '工单已提交，客服将在24小时内回复', data });
    } catch (error) {
      handleError(res, error);
    }
  },

  async getTicketStatus(req, res) {
    try {
      const { ticket_id } = req.params;
      const userId = req.user.sub;
      const data = await supportService.getTicketStatus(ticket_id, userId);
      res.status(200).json({ code: 200, data });
    } catch (error) {
      if (error.code === 'FORBIDDEN') {
        res.status(403).json({ code: 403, message: '无权访问此工单' });
      } else {
        handleError(res, error);
      }
    }
  }
};