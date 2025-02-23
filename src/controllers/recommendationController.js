const recommendationService = require('../services/recommendationService');
const { handleError } = require('./authController');

module.exports = {
  async getRecommendations(req, res) {
    try {
      const { category, limit = 5 } = req.query;
      const userId = req.user.sub;
      const data = await recommendationService.getRecommendations(userId, category, limit);
      res.status(200).json({ code: 200, data });
    } catch (error) {
      handleError(res, error);
    }
  }
};