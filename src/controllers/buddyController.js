const buddyService = require('../services/buddyService');
const { handleError } = require('./authController');

module.exports = {
  async submitRequirement(req, res) {
    try {
      const userId = req.user.sub;
      const { destination, start_date, people_num, budget, interests } = req.body;
      const data = await buddyService.submitRequirement(userId, { destination, start_date, people_num, budget, interests });
      res.status(201).json({ code: 201, message: '需求提交成功，正在匹配中...', data });
    } catch (error) {
      handleError(res, error);
    }
  },

  async getPosts(req, res) {
    try {
      const { page = 1, page_size = 10, destination } = req.query;
      const data = await buddyService.getPosts(parseInt(page), parseInt(page_size), destination);
      res.status(200).json({ code: 200, data });
    } catch (error) {
      handleError(res, error);
    }
  }
};